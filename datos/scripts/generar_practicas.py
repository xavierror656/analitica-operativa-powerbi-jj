"""Caso sintético del Plan_Practicas_PowerBI_Dias2-5. Herramienta del autor.

Los ZIP contienen capturas crudas, nunca tablas de hechos resueltas ni KPI precalculados.
Semilla fija, ZIP determinista y soluciones reservadas en material-instructor/.
"""
from pathlib import Path
from datetime import date, datetime, timedelta
from collections import defaultdict, Counter
import csv, io, json, random, hashlib, zipfile, statistics

ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'public/descargas/practicas'
TEACH=ROOT/'material-instructor/practicas'
START=date(2025,1,1)
END=date(2026,6,30)
holidays={date(2025,1,1),date(2025,5,1),date(2025,9,16),date(2025,12,25),date(2026,1,1),date(2026,5,1)}


def csv_bytes(rows):
    buffer=io.StringIO(newline='')
    writer=csv.DictWriter(buffer,fieldnames=list(rows[0]),lineterminator='\n')
    writer.writeheader(); writer.writerows(rows)
    return ('\ufeff'+buffer.getvalue()).encode('utf8')


def zip_write(path,files):
    with zipfile.ZipFile(path,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as z:
        for name,data in sorted(files.items()):
            info=zipfile.ZipInfo(name,date_time=(2026,9,22,0,0,0))
            info.compress_type=zipfile.ZIP_DEFLATED
            z.writestr(info,data.encode('utf8') if isinstance(data,str) else data)


def make_data():
    RNG=random.Random(20260922)
    lines=[dict(linea_id=f'L{i}',nombre_linea=f'Línea {i}',area='Ensamble' if i<3 else 'Empaque',celda=f'C{i}') for i in range(1,5)]
    parts=[dict(parte_id=f'P{i:03}',descripcion=f'Componente {i}',familia=['Ensamble','Empaque'][i%2],estandar_hora=[100,110,120,90,30][i-1]) for i in range(1,6)]
    actual_standards={p['parte_id']:125 if p['parte_id']=='P005' else p['estandar_hora'] for p in parts}
    equipment=[dict(equipo_id=f'E{i}{j}',linea_id=f'L{i}',descripcion=f'Estación {j} de línea {i}') for i in range(1,5) for j in [1,2]]
    shifts=[dict(turno=str(i),nombre=f'Turno {i}',hora_inicio=f'{h:02}:00',hora_fin=f'{(h+8)%24:02}:00') for i,h in [(1,6),(2,14),(3,22)]]
    defects=[dict(defecto_id=f'D{i:02}',descripcion=f'Defecto {i}',categoria='Dimensional' if i<=3 else 'Acabado') for i in range(1,7)]
    calendar=[]
    current=date(2025,1,1)
    while current<=date(2026,12,31):
        calendar.append(dict(fecha=current.isoformat(),anio=current.year,trimestre=(current.month-1)//3+1,mes=current.month,nombre_mes=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'][current.month-1],anio_mes=current.strftime('%Y-%m'),semana_iso=current.isocalendar().week,anio_iso=current.isocalendar().year,dia_semana=['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'][current.weekday()],es_habil=int(current.weekday()<6 and current not in holidays)))
        current+=timedelta(days=1)
    production=[]; quality=[]; maintenance=[]; exposure=[]
    seq=0; eventseq=0; qualityseq=0
    current=START
    while current<=END:
        if current.weekday()==6 or current in holidays:
            current+=timedelta(days=1); continue
        quarter_case=date(2026,4,1)<=current<=date(2026,6,30)
        for line in range(1,5):
            for shift,hour in [(1,6),(2,14),(3,22)]:
                seq+=1
                part=f'P{(current.toordinal()+line+shift)%5+1:03}'
                scheduled=450 if shift!=3 or quarter_case else 330
                recurring=quarter_case and line==3 and current.weekday() in [0,2,4] and shift==[1,2,3][current.weekday()//2]
                ordinary=(current.toordinal()+line*13+shift*7)%23==0
                downtime=90 if recurring else 25 if ordinary else 0
                run=scheduled-downtime
                eventend=None
                if recurring or ordinary:
                    eventseq+=1
                    eq=f'E{line}1' if recurring else f'E{line}{1+eventseq%2}'
                    dt=datetime.combine(current,datetime.min.time()).replace(hour=hour,minute=30)
                    eventend=dt+timedelta(minutes=downtime)
                    maintenance.append(dict(evento_id=f'M{eventseq:05}',fecha=current.isoformat(),equipo_id=eq,linea_id=f'L{line}',tipo='correctivo',inicio=dt.isoformat(sep=' '),fin=eventend.isoformat(sep=' '),duracion_min=downtime,afecta_produccion=1,causa='Desajuste de alimentación' if recurring else 'Cambio de sensor'))
                if (current.toordinal()+line*3+shift)%47==0:
                    eventseq+=1
                    dt=datetime.combine(current,datetime.min.time()).replace(hour=hour)
                    maintenance.append(dict(evento_id=f'M{eventseq:05}',fecha=current.isoformat(),equipo_id=f'E{line}2',linea_id=f'L{line}',tipo='correctivo',inicio=dt.isoformat(sep=' '),fin=(dt+timedelta(minutes=12)).isoformat(sep=' '),duracion_min=12,afecta_produccion=0,causa='Ajuste auxiliar sin paro'))
                if shift==1 and current.weekday()==5:
                    eventseq+=1
                    dt=datetime.combine(current,datetime.min.time()).replace(hour=5)
                    maintenance.append(dict(evento_id=f'M{eventseq:05}',fecha=current.isoformat(),equipo_id=f'E{line}2',linea_id=f'L{line}',tipo='preventivo',inicio=dt.isoformat(sep=' '),fin=(dt+timedelta(minutes=30)).isoformat(sep=' '),duracion_min=30,afecta_produccion=0,causa='Inspección programada'))
                speed=.90+RNG.uniform(-.018,.018)
                produced=round(run/60*actual_standards[part]*speed)
                scrap_rate=.034+RNG.uniform(-.002,.002)
                if line==2 and current>=date(2025,10,1): scrap_rate=.012+RNG.uniform(-.001,.001)
                if line==4 and current.year==2026 and current.month==5: scrap_rate=.004+RNG.uniform(-.0005,.0005)
                if recurring: scrap_rate=.135
                rejected=round(produced*scrap_rate)
                lot=f'{current:%Y%m%d}-L{line}-{shift}-{seq:05}'
                production.append(dict(registro_id=f'P{seq:05}',fecha=current.isoformat(),linea_id=f'L{line}',turno=str(shift),parte_id=part,lote=lot,piezas_plan=round(scheduled/60*actual_standards[part]*.93),piezas_producidas=produced,piezas_buenas=produced-rejected,minutos_programados=scheduled,paro_min=downtime,operacion_min=run))
                split=round(rejected*.7) if recurring else round(rejected*.4)
                for j,qty in enumerate([split,rejected-split]):
                    if not qty: continue
                    qualityseq+=1
                    when=(eventend+timedelta(minutes=10+j*15)) if recurring else datetime.combine(current,datetime.min.time()).replace(hour=hour,minute=10+j*20)
                    quality.append(dict(evento_calidad_id=f'Q{qualityseq:06}',fecha=current.isoformat(),fecha_hora=when.isoformat(sep=' '),linea_id=f'L{line}',turno=str(shift),parte_id=part,lote=lot,tipo_defecto='D01' if recurring or line==2 else f'D{(seq+j)%6+1:02}',piezas_rechazadas=qty,etapa='arranque' if recurring else 'proceso',inspector_id=f'I{(seq+j)%6+1:02}'))
                for j in [1,2]:
                    exposure.append(dict(fecha=current.isoformat(),linea_id=f'L{line}',equipo_id=f'E{line}{j}',turno=str(shift),minutos_operacion=run))
        current+=timedelta(days=1)
    return dict(dim_linea=lines,dim_parte=parts,dim_turno=shifts,dim_defecto=defects,dim_equipo=equipment,dim_calendario=calendar,fact_produccion=production,fact_calidad=quality,fact_mantenimiento=maintenance,fact_exposicion_equipo=exposure),actual_standards


def raw_capture(data):
    """Defectos de captura recuperables. El escenario 2.3 agrega fallas distintas."""
    raw={k:[dict(r) for r in rows] for k,rows in data.items()}
    for name in ['fact_produccion','fact_calidad','fact_mantenimiento']:
        rows=raw[name]
        for i,row in enumerate(rows):
            if i%41==0: row['fecha']=date.fromisoformat(row['fecha']).strftime('%d/%m/%Y')
            if i%53==0: row['linea_id']=' '+row['linea_id']+' '
            if 'parte_id' in row and i%67==0: row['parte_id']+=' '
            if name=='fact_calidad' and i%71==0: row['tipo_defecto']+=' '
        rows.extend(dict(r) for r in rows[:8])
    return raw


def indicators(data,standards,desde='2025-01-01',hasta='2026-06-30',linea=None,turno=None,raw_standard=False):
    def filt(r,shift=True):
        return desde<=r['fecha']<=hasta and (linea is None or r['linea_id']==linea) and (not shift or turno is None or r.get('turno')==turno)
    p=[r for r in data['fact_produccion'] if filt(r)]
    q=[r for r in data['fact_calidad'] if filt(r)]
    def turno_evento(r):
        hour=datetime.fromisoformat(r['inicio']).hour
        return '1' if 6<=hour<14 else '2' if 14<=hour<22 else '3'
    # Controles finales de 3.2 en adelante: turno derivado y relacionado explícitamente.
    m=[r for r in data['fact_mantenimiento'] if filt(dict(r,turno=turno_evento(r))) and r['tipo']=='correctivo' and r['afecta_produccion']==1]
    e=[r for r in data['fact_exposicion_equipo'] if filt(r)]
    piezas=sum(r['piezas_producidas'] for r in p); buenas=sum(r['piezas_buenas'] for r in p)
    plan=sum(r['piezas_plan'] for r in p); scheduled=sum(r['minutos_programados'] for r in p); operation=sum(r['operacion_min'] for r in p)
    st={r['parte_id']:r['estandar_hora'] for r in data['dim_parte']} if raw_standard else standards
    ideal=sum(r['piezas_producidas']/st[r['parte_id']] for r in p)
    ratio=lambda a,b:a/b if b else None
    availability=ratio(operation,scheduled); perf=ratio(ideal,operation/60); yield_=ratio(buenas,piezas)
    return dict(piezas=piezas,plan=plan,buenas=buenas,rechazadas=sum(r['piezas_rechazadas'] for r in q),programados_min=scheduled,operacion_min=operation,paro_min=scheduled-operation,cumplimiento=ratio(piezas,plan),scrap=ratio(piezas-buenas,piezas),yield_=yield_,disponibilidad=availability,rendimiento=perf,oee=availability*perf*yield_ if piezas else None,correctivos=len(m),mttr_min=ratio(sum(r['duracion_min'] for r in m),len(m)),mtbf_h=ratio(sum(r['minutos_operacion'] for r in e)/60,len(m)))


def controls(data,standards):
    monthly=[]
    for y,m in [(2025,i) for i in range(1,13)]+[(2026,i) for i in range(1,7)]:
        start=date(y,m,1); end=(date(y+1,1,1) if m==12 else date(y,m+1,1))-timedelta(days=1)
        for line in range(1,5):
            monthly.append(dict(mes=start.strftime('%Y-%m'),linea=f'L{line}',**indicators(data,standards,start.isoformat(),end.isoformat(),f'L{line}')))
    cases=[dict(caso='Todo el periodo',**indicators(data,standards)),dict(caso='2026-04-06 L3 turno 1',**indicators(data,standards,'2026-04-06','2026-04-06','L3','1')),dict(caso='2026-04-06 L3 todos los turnos',**indicators(data,standards,'2026-04-06','2026-04-06','L3'))]
    p=data['fact_produccion'];q=data['fact_calidad'];m=data['fact_mantenimiento']
    def winners(rows,key,value):
        c=Counter()
        for r in rows:c[r[key]]+=r[value] if value else 1
        top=max(c.values());return dict(ganadores=[k for k,v in c.items() if v==top],valor=top)
    cal={r['fecha']:r for r in data['dim_calendario']}
    families={r['parte_id']:r['familia'] for r in data['dim_parte']}
    holidayweeks={(d.isocalendar().year,d.isocalendar().week) for d in holidays}
    answers=[winners([r for r in p if '2025-03-01'<=r['fecha']<='2025-03-31'],'linea_id','paro_min'),winners([r for r in m if '2026-04-01'<=r['fecha']<='2026-06-30' and r['tipo']=='correctivo'],'equipo_id',None),winners([dict(r,familia=families[r['parte_id']]) for r in p],'familia','piezas_producidas'),winners([dict(r,dia=cal[r['fecha']]['dia_semana']) for r in q],'dia','piezas_rechazadas'),winners([r for r in q if r['linea_id']=='L2'],'tipo_defecto','piezas_rechazadas'),winners([r for r in p if (cal[r['fecha']]['anio_iso'],cal[r['fecha']]['semana_iso']) in holidayweeks],'turno','piezas_producidas'),dict(piezas=sum(r['piezas_producidas'] for r in p if cal[r['fecha']]['anio_iso']==2025 and 10<=cal[r['fecha']]['semana_iso']<=14))]
    selection=[r for r in p if r['fecha'].startswith('2026-04') and r['linea_id']=='L3' and r['turno']=='1']
    correct=[r for r in m if r['fecha'].startswith('2026-04') and r['linea_id']=='L3' and r['tipo']=='correctivo' and r['afecta_produccion']==1]
    forecasts=[sum(r['piezas_producidas'] for r in selection),sum(r['piezas_producidas'] for r in p if r['fecha'].startswith('2026-04') and r['linea_id']=='L3' and r['turno']=='3'),sum(r['piezas_producidas'] for r in p if r['fecha'].startswith('2026-04') and r['turno']=='1'),None,sum(r['piezas_producidas'] for r in selection if r['piezas_producidas']>=600),sum(r['piezas_producidas']-r['piezas_buenas'] for r in selection)/sum(r['piezas_producidas'] for r in selection),sum(r['piezas_producidas']-r['piezas_buenas'] for r in selection),sum(r['duracion_min'] for r in correct)/len(correct)]
    byeq=defaultdict(list)
    for r in correct:byeq[r['equipo_id']].append(r['duracion_min'])
    return dict(cortes=cases,mensual=monthly,preguntas_2_2=answers,predicciones_3_1=forecasts,mttr_media_equipos=statistics.mean(statistics.mean(v) for v in byeq.values()),mttr_ponderado=forecasts[-1],oee_estandar_crudo=indicators(data,standards,raw_standard=True)['oee'])


def main():
    OUT.mkdir(parents=True,exist_ok=True);TEACH.mkdir(parents=True,exist_ok=True)
    data,standards=make_data();raw=raw_capture(data);control=controls(data,standards)
    meses=[dict(mes=f'2025-{month:02}',piezas=sum(r['piezas'] for r in control['mensual'] if r['mes']==f'2025-{month:02}')) for month in range(1,13)]
    lines=[dict(linea=f'L{i}',oee=indicators(data,standards,'2026-04-01','2026-06-30',f'L{i}')['oee']) for i in range(1,5)]
    overall=control['cortes'][0]
    gauge=[dict(nombre=n,valor=f'{overall[k]*100:.1f}%') for n,k in [('OEE','oee'),('Plan','cumplimiento'),('Scrap','scrap'),('Disp.','disponibilidad'),('Yield','yield_')]]+[dict(nombre='MTTR',valor=f"{overall['mttr_min']:.1f}m")]
    (ROOT/'src/data/practicas-reporte.json').write_text(json.dumps(dict(meses=meses,lineas=lines,medidores=gauge),ensure_ascii=False,indent=2)+'\n',encoding='utf8')
    (TEACH/'controles.json').write_text(json.dumps(control,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
    (ROOT/'tmp/practicas-truth.json').write_text(json.dumps(data,ensure_ascii=False),encoding='utf8')
    files={}
    for name,rows in raw.items():
        if name.startswith('fact_') and name!='fact_exposicion_equipo':
            groups=defaultdict(list)
            for row in rows:
                d=datetime.strptime(row['fecha'],'%d/%m/%Y').date() if '/' in row['fecha'] else date.fromisoformat(row['fecha'])
                groups[d.strftime('%Y-%m')].append(row)
            for month,group in groups.items():files[f'crudos/{name}/{month}.csv']=csv_bytes(group)
        else:files[f'crudos/{name}.csv']=csv_bytes(rows)
    (ROOT/'src/data/practicas-dataset.json').write_text(json.dumps(dict(version='practicas-2026-09-v1',desde=str(START),hasta=str(END),tablas={k:len(v) for k,v in raw.items()},control_piezas=control['cortes'][0]['piezas']),ensure_ascii=False,indent=2)+'\n',encoding='utf8')
    # Tres filas y dos eventos: combinar por fecha duplica el total 600 a 1200.
    demo_prod=[dict(fecha='2026-04-06',lote=f'DEMO-{i}',piezas=i*100) for i in [1,2,3]]
    demo_m=[dict(fecha='2026-04-06',evento=f'EV-{i}') for i in [1,2]]
    files['recursos/estandares_ingenieria.csv']=csv_bytes([dict(parte_id=k,estandar_hora=v,unidad='piezas/hora',vigente_desde='2025-01-01',revision='R02',origen='Ficha didáctica de ingeniería') for k,v in standards.items()])
    files['recursos/metas.csv']=csv_bytes([dict(indicador=n,meta=v,unidad=u,sentido=s,alcance='Meta didáctica; no objetivo corporativo') for n,v,u,s in [('OEE',.85,'razon','mayor'),('Cumplimiento',.95,'razon','mayor'),('Scrap',.02,'razon','menor'),('Disponibilidad',.95,'razon','mayor'),('MTTR',40,'min','menor')]])
    # Recursos se incorporan sin soluciones a cada paquete pertinente.
    source=ROOT/'src/content/practicas'
    manifest=[]
    for activity in json.loads((ROOT/'src/data/practicas-plan.json').read_text(encoding='utf8')):
        ident=activity['id']; bundle=dict(files)
        bundle['LEEME.md']=f"# Actividad {activity['numero']} · {activity['titulo']}\n\nDataset sintético Prácticas 2025–2026. No mezclar con el ZIP anterior del curso.\n\nLos archivos de crudos son capturas por registro, sin KPI ni modelo resuelto. Contienen espacios en claves, fechas ISO y dd/MM/yyyy y ocho duplicados exactos en cada uno de los tres hechos principales. Se corrigen en Power Query conservando una copia. El estándar de parte se valida con la ficha de ingeniería durante 3.2. No alteres el archivo fuente.\n\nCombina por carpeta una familia de hechos a la vez. Dimensiones y exposición por equipo se cargan como CSV individuales. Los CSV usan coma, UTF-8 y punto decimal.\n\nContinúa tu PBIX de la actividad anterior. Los datos repetidos en cada ZIP permiten recuperar la práctica; no anexes ZIP de distintas actividades entre sí.\n\nConsulta CONSIGNA.md, diccionario.md y montaje.md.\n"
        for name in ['diccionario.md','montaje.md']:
            if (source/name).exists():bundle[name]=(source/name).read_text(encoding='utf8')
        if (source/f'{ident}.md').exists():bundle['CONSIGNA.md']=(source/f'{ident}.md').read_text(encoding='utf8')
        else:bundle['CONSIGNA.md']=activity['proposito']+'\n\n'+'\n'.join(f"{p['minutos']} min · {p['texto']}" for p in activity['pasos'])
        if ident=='2-1':
            bundle['microcaso/produccion.csv']=csv_bytes(demo_prod);bundle['microcaso/eventos.csv']=csv_bytes(demo_m)
        if ident=='2-3':
            # Casos aislados: el maestro no se contamina con estas copias.
            small=[dict(r) for r in data['fact_calidad'][:36]]
            bundle['laboratorio/caso-a/calidad.csv']=csv_bytes(small)
            bundle['laboratorio/caso-b/calidad.csv']=csv_bytes([dict(r,fecha=r['fecha_hora']) for r in small])
            bundle['laboratorio/caso-c/partes.csv']=csv_bytes(data['dim_parte']+[dict(data['dim_parte'][0],parte_id=data['dim_parte'][0]['parte_id']+' ')])
            bundle['laboratorio/caso-d/calidad.csv']=csv_bytes([dict(r,linea_id=int(r['linea_id'][1:])) for r in small])
        for extra in (source/ident).glob('*') if (source/ident).exists() else []:
            if extra.is_file():bundle['actividad/'+extra.name]=extra.read_bytes()
        dest=OUT/f'actividad-{ident}.zip';zip_write(dest,bundle)
        manifest.append(dict(id=ident,archivo=dest.name,sha256=hashlib.sha256(dest.read_bytes()).hexdigest(),archivos=len(bundle),bytes=dest.stat().st_size))
    (OUT/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
    zip_write(OUT/'todas-las-actividades.zip',{x['archivo']:(OUT/x['archivo']).read_bytes() for x in manifest})
    print(json.dumps(dict(tablas={k:len(v) for k,v in data.items()},cortes=control['cortes'],oee_crudo=control['oee_estandar_crudo'],predicciones=control['predicciones_3_1'],paquetes=len(manifest)),ensure_ascii=False,indent=2))


if __name__=='__main__':main()
