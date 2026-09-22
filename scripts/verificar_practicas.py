"""Controles independientes de los ZIP, el caso narrativo y las rutas compiladas."""
from pathlib import Path
from collections import defaultdict,Counter
from datetime import date,datetime,timedelta
from fractions import Fraction
import csv,io,json,zipfile,hashlib,re,sqlite3,importlib.util
from urllib.parse import urljoin,urlparse,unquote

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'public/descargas/practicas'


def read_data(z):
    tables=defaultdict(list)
    for name in z.namelist():
        if not name.startswith('crudos/') or not name.endswith('.csv'):continue
        table=name.split('/')[1].removesuffix('.csv')
        tables[table].extend(csv.DictReader(io.StringIO(z.read(name).decode('utf-8-sig'))))
    return tables


def clean(rows):
    seen=set();result=[]
    numbers={'piezas_plan','piezas_producidas','piezas_buenas','minutos_programados','paro_min','operacion_min','piezas_rechazadas','duracion_min','afecta_produccion','minutos_operacion','estandar_hora','anio','trimestre','mes','semana_iso','anio_iso','es_habil'}
    for row in rows:
        key=tuple(row.items())
        if key in seen:continue
        seen.add(key)
        r={k:v.strip() for k,v in row.items()}
        if 'fecha' in r and '/' in r['fecha']:
            day,month,year=map(int,r['fecha'].split('/'));r['fecha']=date(year,month,day).isoformat()
        for k in numbers.intersection(r):r[k]=int(r[k])
        result.append(r)
    return result


def main():
    manifest=json.loads((OUT/'manifest.json').read_text(encoding='utf8'))
    assert len(manifest)==16
    base=None
    for item in manifest:
        blob=(OUT/item['archivo']).read_bytes()
        assert hashlib.sha256(blob).hexdigest()==item['sha256']
        with zipfile.ZipFile(io.BytesIO(blob)) as z:
            assert z.testzip() is None
            names=z.namelist()
            assert all(not n.startswith('/') and '..' not in n.split('/') for n in names)
            assert {'CONSIGNA.md','montaje.md','diccionario.md','LEEME.md'}<=set(names)
            raw=read_data(z)
            raw_blobs={n:z.read(n) for n in names if n.startswith('crudos/')}
            if base is None:base=raw_blobs
            else:assert raw_blobs==base,'El caso debe ser idéntico en los 16 paquetes'
            assert not any('solucion' in n or 'controles.json' in n or '.pbix' in n for n in names)
            if item['id'][0]!='5':assert not any(n.endswith('.py') for n in names)
            assert len(names)==item['archivos']
    data={name:clean(rows) for name,rows in raw.items()}
    p=data['fact_produccion'];q=data['fact_calidad'];m=data['fact_mantenimiento'];e=data['fact_exposicion_equipo']
    assert [len(p),len(q),len(m),len(e)]==[5544,11088,708,11088]
    for name in ['fact_produccion','fact_calidad','fact_mantenimiento']:
        assert len(raw[name])-len(data[name])==8
        assert any('/' in r['fecha'] for r in raw[name])
        assert any(r['linea_id']!=r['linea_id'].strip() for r in raw[name])
    assert 'turno' not in m[0]
    assert len({(r['fecha'],r['linea_id'],r['turno']) for r in p})==len(p),'Tiempos de línea únicos'
    bylot=Counter()
    for r in q:bylot[r['lote']]+=r['piezas_rechazadas']
    for r in p:
        assert r['piezas_producidas']-r['piezas_buenas']==bylot[r['lote']]
        assert r['minutos_programados']==r['operacion_min']+r['paro_min']
    for dim,key in [('dim_linea','linea_id'),('dim_parte','parte_id'),('dim_equipo','equipo_id'),('dim_defecto','defecto_id'),('dim_turno','turno'),('dim_calendario','fecha')]:
        keys={r[key] for r in data[dim]};assert len(keys)==len(data[dim])
        for name,rows in data.items():
            if not name.startswith('fact_'):continue
            field='tipo_defecto' if dim=='dim_defecto' else key
            if field in rows[0]:assert {r[field] for r in rows}<=keys,(dim,name)
    calendar=sorted(r['fecha'] for r in data['dim_calendario'])
    assert len(calendar)==730 and all(date.fromisoformat(b)-date.fromisoformat(a)==timedelta(days=1) for a,b in zip(calendar,calendar[1:]))
    # Agregación SQL de los registros decodificados, independiente del generador.
    db=sqlite3.connect(':memory:');db.execute('CREATE TABLE p(fecha TEXT,linea TEXT,turno TEXT,piezas INT,buenas INT,plan INT,operacion INT,programados INT,parte TEXT)')
    db.executemany('INSERT INTO p VALUES(?,?,?,?,?,?,?,?,?)',[(r['fecha'],r['linea_id'],r['turno'],r['piezas_producidas'],r['piezas_buenas'],r['piezas_plan'],r['operacion_min'],r['minutos_programados'],r['parte_id']) for r in p])
    assert db.execute('SELECT SUM(piezas),SUM(piezas-buenas) FROM p').fetchone()==(3761757,117998)
    monthly={}
    for month,line,pieces,reject in db.execute('SELECT substr(fecha,1,7),linea,SUM(piezas),SUM(piezas-buenas) FROM p GROUP BY 1,2'):
        monthly[(month,line)]=reject/pieces
    assert all(monthly[(f'2025-{i:02}','L2')]<.014 for i in [10,11,12])
    assert all(monthly[(f'2026-{i:02}','L2')]<.014 for i in range(1,7))
    assert all(monthly[(f'2025-{i:02}','L2')]>.03 for i in range(1,10))
    assert monthly[('2026-05','L4')]<.006 and monthly[('2026-06','L4')]>.03
    assert sum(monthly[(f'2026-{i:02}','L4')] for i in [4,5,6])/3>3*monthly[('2026-05','L4')]
    # Fallas recurrentes y secuencia de arranque, sin columnas de respuesta.
    recurrent=[r for r in m if r['equipo_id']=='E31' and r['causa']=='Desajuste de alimentación']
    assert len(recurrent)==38  # El 1 de mayo es inhábil; el evento 39 de E31 tiene otra causa.
    assert all('2026-04-01'<=r['fecha']<='2026-06-30' and r['duracion_min']==90 for r in recurrent)
    for event in recurrent:
        end=datetime.fromisoformat(event['fin'])
        linked=[r for r in q if r['linea_id']=='L3' and r['fecha']==event['fecha'] and r['etapa']=='arranque' and end<datetime.fromisoformat(r['fecha_hora'])<=end+timedelta(hours=2)]
        assert len(linked)==2
    for line in ['L1','L2','L3','L4']:
        before=[r for r in p if r['linea_id']==line and r['turno']=='3' and '2026-01-01'<=r['fecha']<='2026-03-31']
        after=[r for r in p if r['linea_id']==line and r['turno']=='3' and r['fecha']>='2026-04-01']
        assert {r['minutos_programados'] for r in before}=={330}
        assert {r['minutos_programados'] for r in after}=={450}
    standards={r['parte_id']:r['estandar_hora'] for r in data['dim_parte']}
    def oee(rows,st):
        pieces=sum(r['piezas_producidas'] for r in rows);good=sum(r['piezas_buenas'] for r in rows)
        planned=sum(r['minutos_programados'] for r in rows);oper=sum(r['operacion_min'] for r in rows)
        ideal=sum(Fraction(r['piezas_producidas'],st[r['parte_id']]) for r in rows)
        return float(Fraction(oper,planned)*(ideal/Fraction(oper,60))*Fraction(good,pieces))
    assert oee(p,standards)>1
    standards['P005']=125
    corrected=oee(p,standards);assert 0<corrected<1
    baseline=oee([r for r in p if r['linea_id']=='L3' and '2026-01-01'<=r['fecha']<='2026-03-31'],standards)
    case=oee([r for r in p if r['linea_id']=='L3' and r['fecha']>='2026-04-01'],standards)
    assert case<baseline-.025
    oracle=json.loads((ROOT/'material-instructor/practicas/controles.json').read_text(encoding='utf8'))
    assert abs(oracle['cortes'][0]['oee']-corrected)<1e-10
    assert abs(oracle['mttr_media_equipos']-oracle['mttr_ponderado'])>10
    # Variantes materialmente distintas; el estado inactivo se monta en Desktop.
    with zipfile.ZipFile(OUT/'actividad-2-3.zip') as z:
        rows=lambda name:list(csv.DictReader(io.StringIO(z.read(name).decode('utf-8-sig'))))
        assert all(' ' in r['fecha'] for r in rows('laboratorio/caso-b/calidad.csv'))
        parts=rows('laboratorio/caso-c/partes.csv');assert len({r['parte_id'].strip() for r in parts})<len(parts)
        assert all(r['linea_id'].isdigit() for r in rows('laboratorio/caso-d/calidad.csv'))
    development=json.loads((ROOT/'src/data/practicas-desarrollo.json').read_text(encoding='utf8'))
    slide_count=0
    for ident,a in development.items():
        assert sum(paso[0] for paso in a['pasos'])==90
        html=(ROOT/f'dist/practicas/{ident}/index.html').read_text(encoding='utf8')
        count=len(re.findall(r'<section(?:\s|>)',html));expected=len(a['pasos'])+4+(ident=='4-1')
        assert count==expected,(ident,count,expected);slide_count+=count
        assert len(re.findall(r'<aside class="notes"',html))==count
        assert f'actividad-{ident}.zip' in html
        if ident[0]!='5':assert not re.search(r'\bpython\b',html,re.I)
        for href in re.findall(r'(?:href|src)="([^"]+)"',html):
            if href.startswith(('http:','https:','data:','#')):continue
            resolved=urlparse(urljoin('https://powerbi.floresjavier.com/practicas/'+ident+'/',href))
            path=unquote(resolved.path.lstrip('/'))
            assert (ROOT/'dist'/path).exists() or (ROOT/'dist'/path/'index.html').exists(),href
    spec=importlib.util.spec_from_file_location('verificador_alumno',ROOT/'src/content/practicas/5-3/verificar_practicas.py')
    mod=importlib.util.module_from_spec(spec);spec.loader.exec_module(mod)
    assert mod.verificar(OUT/'actividad-5-3.zip')['piezas']==3761757
    selected=mod.verificar(OUT/'actividad-5-3.zip','2026-04-06','2026-04-06','L3','1')
    assert selected['piezas']==592 and selected['rechazadas']==80 and selected['conciliacion']
    assert mod.verificar(OUT/'actividad-5-3.zip','2024-01-01','2024-01-31')['scrap'] is None
    with zipfile.ZipFile(OUT/'actividad-5-3.zip') as z:
        assert z.read('actividad/verificar_practicas.py')==(ROOT/'src/content/practicas/5-3/verificar_practicas.py').read_bytes()
    with zipfile.ZipFile(OUT/'todas-las-actividades.zip') as z:
        assert len(z.namelist())==16
        for item in manifest:assert z.read(item['archivo'])==(OUT/item['archivo']).read_bytes()
    print(json.dumps(dict(paquetes=16,slides=slide_count,actividades_90_min=16,piezas=3761757,rechazadas=117998,oee_corregido=corrected,oee_L3_Q1=baseline,oee_L3_Q2=case,patrones='cinco patrones comprobados',fallas_recurrentes=38),ensure_ascii=False,indent=2))


if __name__=='__main__':main()
