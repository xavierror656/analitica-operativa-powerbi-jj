"""Día 5: verifica producción y rechazo del caso Prácticas, sin leer PBIX ni ejecutar DAX."""
import argparse,csv,io,json,zipfile
from datetime import date,datetime

def leer(z,tabla):
    rows=[];seen=set()
    for name in sorted(z.namelist()):
        if not name.startswith('crudos/'+tabla+'/') or not name.endswith('.csv'):continue
        for r in csv.DictReader(io.StringIO(z.read(name).decode('utf-8-sig'))):
            key=tuple(r.items())
            if key in seen:continue
            seen.add(key)
            for field in ['linea_id','parte_id','tipo_defecto']:
                if field in r:r[field]=r[field].strip()
            r['fecha']=datetime.strptime(r['fecha'],'%d/%m/%Y').date().isoformat() if '/' in r['fecha'] else date.fromisoformat(r['fecha']).isoformat()
            rows.append(r)
    if not rows:raise ValueError('El ZIP no contiene '+tabla+' del caso Prácticas')
    return rows

def verificar(path,desde='2025-01-01',hasta='2026-06-30',linea=None,turno=None):
    date.fromisoformat(desde);date.fromisoformat(hasta)
    if desde>hasta:raise ValueError('Periodo invertido')
    def filtra(r):return desde<=r['fecha']<=hasta and (linea is None or r['linea_id']==linea) and (turno is None or r['turno']==turno)
    with zipfile.ZipFile(path) as z:
        p=list(filter(filtra,leer(z,'fact_produccion')));q=list(filter(filtra,leer(z,'fact_calidad')))
    total=sum(int(r['piezas_producidas']) for r in p)
    buenas=sum(int(r['piezas_buenas']) for r in p)
    rechazo=sum(int(r['piezas_rechazadas']) for r in q)
    return dict(filas_produccion=len(p),piezas=total,buenas=buenas,rechazadas= rechazo,scrap= rechazo/total if total else None,conciliacion=total-buenas==rechazo)

if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('zip');parser.add_argument('--desde',default='2025-01-01');parser.add_argument('--hasta',default='2026-06-30');parser.add_argument('--linea',choices=['L1','L2','L3','L4']);parser.add_argument('--turno',choices=['1','2','3'])
    args=parser.parse_args()
    try:print(json.dumps(verificar(args.zip,args.desde,args.hasta,args.linea,args.turno),indent=2))
    except (ValueError,KeyError,OSError,zipfile.BadZipFile) as e:parser.error(str(e))
