"""Genera consignas y formularios desde el plan y su desarrollo didáctico."""
from pathlib import Path
import csv,io,json

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'src/content/practicas'
plan=json.loads((ROOT/'src/data/practicas-plan.json').read_text(encoding='utf8'))
development=json.loads((ROOT/'src/data/practicas-desarrollo.json').read_text(encoding='utf8'))
classroom=json.loads((ROOT/'src/data/practicas-aula.json').read_text(encoding='utf8'))


def write_csv(ident,name,cols,rows):
    dest=OUT/ident;dest.mkdir(parents=True,exist_ok=True)
    with (dest/name).open('w',encoding='utf-8-sig',newline='') as f:
        w=csv.writer(f,lineterminator='\n');w.writerow(cols);w.writerows(rows)


def write_text(ident,name,text):
    dest=OUT/ident;dest.mkdir(parents=True,exist_ok=True)
    (dest/name).write_text(text.rstrip()+'\n',encoding='utf8')


def main():
    for a in plan:
        d=development[a['id']]
        f=classroom[a['id']]
        text=f"# {a['numero']} · {a['titulo']}\n\n{f['objetivo']}\n\n90 minutos. Caso Prácticas 2025–2026; conservar un único PBIX acumulativo.\n\n"
        text+='## Tu entrega, paso a paso\n\n'+'\n'.join(f"- **{label}:** {f[key]}" for key,label in [('abre','Abre'),('construye','Construye'),('comprueba','Comprueba'),('entrega','Entrega')])+'\n\n'
        text+='## Materiales\n\n'+'\n'.join('- '+r for r in d['recursos'])+'\n\n'
        if d.get('nota'):text+='## Decisión de implementación\n\n'+d['nota']+'\n\n'
        for minutes,title,actions,*formula in d['pasos']:
            text+=f'## {title} · {minutes} minutos\n\n'+'\n'.join(f'{i+1}. {s}' for i,s in enumerate(actions))+'\n\n'
            if formula:text+='```dax\n'+formula[0]+'\n```\n\n'
        text+='## Evidencia\n\n'+d.get('evidencia',a['evidencia'])+'\n\n## Ajustes por nivel\n\nPara profundizar: '+a['adelante']+'\n\nCon apoyo: '+a['apoyo']+'\n\nRegistrar acompañamiento y criterios pendientes. Reducir temporalmente el alcance no acredita por sí solo la evidencia completa.\n'
        text+='\n## Fuente\n\nPlan_Practicas_PowerBI_Dias2-5.docx, actividad '+a['numero']+'. Las correcciones técnicas y ajustes de minutos se declaran en esta consigna.\n'
        (OUT/(a['id']+'.md')).write_text(text,encoding='utf8')
    questions=[
        '¿Qué línea acumula más minutos de paro en marzo de 2025? Convierte a horas al informar.',
        '¿Qué equipo registra más eventos correctivos en abril–junio de 2026? Incluye correctivos con y sin efecto en producción.',
        '¿Qué familia de parte tiene mayor volumen producido en los 18 meses?',
        '¿Qué día de la semana acumula más piezas rechazadas en los 18 meses?',
        '¿Qué tipo de defecto acumula más piezas rechazadas en L2 en los 18 meses?',
        '¿Qué turno produce más en semanas ISO que contienen uno de estos festivos: 01/01/2025, 01/05/2025, 16/09/2025, 25/12/2025, 01/01/2026, 01/05/2026? Filtra año ISO y semana conjuntamente.',
        '¿Cuántas piezas se produjeron en las semanas ISO 10 a 14 del año ISO 2025?',
        '¿Puede una matriz por inspector mostrar rechazos del lote con mayor paro usando solo las relaciones actuales, sin buscar y copiar manualmente el lote entre tablas?',
        '¿El modelo A2 puede atribuir minutos correctivos por turno usando una dimensión conectada al hecho de mantenimiento?',
        '¿El modelo puede atribuir minutos correctivos a números de parte específicos y distinguirlos de otras partes de la misma línea?']
    write_csv('2-2','preguntas.csv',['numero','pregunta'],[[i+1,q] for i,q in enumerate(questions)])
    write_csv('2-2','respuestas.csv',['numero','respuesta','cifra','unidad','periodo_y_filtros','visual','ruta_o_limitacion','revision'],[[i+1,'','','','','','',''] for i in range(10)])
    symptoms=['El filtro de mes no cambia el total de calidad.','Las fechas con registros aparecen sin valor o en miembro en blanco.','Tras recortar las claves de parte no se puede mantener una dimensión única.','Las claves de línea no empatan o Power BI rechaza los tipos de la relación.']
    write_csv('2-3','sintomas.csv',['caso','sintoma'],[[chr(97+i),s] for i,s in enumerate(symptoms)])
    write_csv('2-3','diagnostico.csv',['caso','sintoma','causa','correccion','vista','prueba_antes','prueba_despues'],[[chr(97+i),'','','','','',''] for i in range(4)])
    checklist=['Granularidad documentada en cada hecho','Relaciones 1:* con filtro único o justificación','Sin relaciones entre hechos','Calendario marcado y continuo','Claves técnicas ocultas','Tipos y claves consistentes en ambos lados','Jerarquías creadas y límites ISO explicados','Cifra de control reconciliada']
    write_csv('2-4','checklist.csv',['criterio','conforme','hallazgo','evidencia','correccion_o_argumento','revisor','fecha','verificacion'],[[s,'','','','','','',''] for s in checklist])
    prediction=[p for p in development['3-1']['pasos'] if len(p)>3]
    write_csv('3-1','predicciones.csv',['ronda','medida','corte','prediccion','observado','explicacion'],[[i+1,p[1],'Abril 2026 / L3 / turno 1','','',''] for i,p in enumerate(prediction)])
    write_text('3-1','predicciones.dax','// Crear cada medida por separado. No ejecutar el archivo completo.\n\n'+'\n\n'.join(p[3] for p in prediction))
    measures=[('Piezas ud','SUM(fact_produccion[piezas_producidas])'),('Plan ud','SUM(fact_produccion[piezas_plan])'),('Buenas ud','SUM(fact_produccion[piezas_buenas])'),('Rechazadas ud','SUM(fact_calidad[piezas_rechazadas])'),('Horas programadas h','DIVIDE(SUM(fact_produccion[minutos_programados]), 60)'),('Horas operación h','DIVIDE(SUM(fact_produccion[operacion_min]), 60)'),('Cumplimiento %','DIVIDE([Piezas ud], [Plan ud])'),('Yield %','DIVIDE([Buenas ud], [Piezas ud])'),('Scrap %','IF(\n    ISFILTERED(fact_produccion[lote]) || ISFILTERED(fact_calidad[lote]),\n    BLANK(),\n    DIVIDE([Rechazadas ud], [Piezas ud])\n)'),('Disponibilidad %','DIVIDE([Horas operación h], [Horas programadas h])'),('Productividad ud/h','DIVIDE([Piezas ud], [Horas operación h])'),('Horas ideales h','SUMX(\n    fact_produccion,\n    DIVIDE(fact_produccion[piezas_producidas], RELATED(dim_parte[estandar_hora]))\n)'),('Rendimiento %','DIVIDE([Horas ideales h], [Horas operación h])'),('OEE %','[Disponibilidad %] * [Rendimiento %] * [Yield %]'),('Fallas n','CALCULATE(\n    COUNTROWS(fact_mantenimiento),\n    fact_mantenimiento[tipo] = "correctivo",\n    fact_mantenimiento[afecta_produccion] = 1\n)'),('Reparación min','CALCULATE(\n    SUM(fact_mantenimiento[duracion_min]),\n    fact_mantenimiento[tipo] = "correctivo",\n    fact_mantenimiento[afecta_produccion] = 1\n)'),('MTTR min','DIVIDE([Reparación min], [Fallas n])'),('Exposición equipos h','DIVIDE(SUM(fact_exposicion_equipo[minutos_operacion]), 60)'),('MTBF h','DIVIDE([Exposición equipos h], [Fallas n])')]
    dax='// Medidas separadas; tabla _Medidas. Si el nombre existe desde 3.1, actualizar esa medida.\n// Porcentajes: formato %, sin multiplicar por 100.\n// MTTR/MTBF requieren el turno derivado y la relación 17 para validar por turno.\n// Scrap por lote queda en BLANK deliberadamente: no existe dimensión compartida de lote.\n// OEE usa tiempos únicos de línea; MTBF utiliza horas-equipo y fallas con paro.\n\n'+'\n\n'.join(n+' =\n'+v for n,v in measures)
    write_text('3-2','medidas.dax',dax)
    time=[('Scrap anterior %','CALCULATE([Scrap %], DATEADD(dim_calendario[fecha], -1, MONTH))'),('Variación scrap %','VAR Actual = [Scrap %]\nVAR Anterior = [Scrap anterior %]\nRETURN IF(ISBLANK(Actual) || ISBLANK(Anterior), BLANK(), DIVIDE(Actual-Anterior, Anterior))'),('Scrap YTD %','DIVIDE(\n    TOTALYTD([Rechazadas ud], dim_calendario[fecha]),\n    TOTALYTD([Piezas ud], dim_calendario[fecha])\n)'),('Scrap mismo periodo AA %','CALCULATE([Scrap %], SAMEPERIODLASTYEAR(dim_calendario[fecha]))'),('Media móvil 3 meses %','VAR Corte = MAX(dim_calendario[fecha])\nVAR FinMes = EOMONTH(Corte, 0)\nVAR Inicio = EOMONTH(Corte, -3)+1\nVAR Ventana = CALCULATETABLE(\n    DATESBETWEEN(dim_calendario[fecha], Inicio, FinMes),\n    REMOVEFILTERS(dim_calendario)\n)\nVAR Meses = CALCULATETABLE(\n    VALUES(dim_calendario[anio_mes]),\n    REMOVEFILTERS(dim_calendario), Ventana\n)\nRETURN IF(\n    Corte < DATE(2025,3,1) || FinMes > DATE(2026,6,30), BLANK(),\n    AVERAGEX(Meses,\n        VAR MesActual = dim_calendario[anio_mes]\n        RETURN CALCULATE([Scrap %], REMOVEFILTERS(dim_calendario),\n            dim_calendario[anio_mes] = MesActual)\n    )\n)')]
    write_text('3-3','tiempo.dax','// Usar en visual por meses completos. Media móvil: media simple de tres tasas mensuales.\n// No es la razón conjunta del trimestre. Ventanas sin tres meses cubiertos devuelven BLANK.\n\n'+'\n\n'.join(n+' =\n'+v for n,v in time))
    write_csv('3-3','conclusion.csv',['linea','cifra','periodo','comparacion','fuente','conclusion_tres_lineas','limite'],[[s,'','','','','',''] for s in ['L2','L4']])
    six=['Cumplimiento','Yield','Scrap','Disponibilidad','OEE','MTTR']
    write_csv('3-4','fichas.csv',['nombre','pregunta','definicion','formula_DAX','unidad_formato','meta_ejemplo','fuente','trampa_comun','responsable'],[[s]+['']*8 for s in six])
    write_csv('3-4','validaciones.csv',['indicador','corte','valor_fuente','valor_PowerBI','precision','diferencia','explicacion'],[[s,c,'','','','',''] for s in six for c in ['fecha','turno','linea']])
    write_csv('4-1','prueba_cinco_segundos.csv',['lector','respuesta_tras_5_segundos','situacion_identificada','cambio_de_diseno','segunda_prueba'],[['']*5])
    write_csv('4-2','recorrido.csv',['linea_periodo','indicador','fecha_operativa','equipo','evento_id','inicio_fin','filtros_conservados','retorno_correcto','limite_de_atribucion'],[['']*9 for _ in range(3)])
    write_csv('4-3','estaciones.csv',['estacion','implementacion','prueba_filtros','resultado','captura','pendiente'],[[s]+['']*5 for s in ['Interacciones','Formato condicional','Tooltip 30 días','Marcadores y botones','Menú']])
    write_csv('4-4','lector.csv',['tipo','pregunta','respuesta_esperada','respuesta_observada','segundos','bloqueo','ajuste','repeticion'],[[s]+['']*7 for s in ['Resumen','Detalle','Trazabilidad']])
    write_csv('5-1','hipotesis.csv',['hipotesis','evidencia_a_favor','evidencia_en_contra','veredicto'],[['']*4 for _ in range(5)])
    write_csv('5-2','pagina_junta.csv',['campo','respuesta'],[[s,''] for s in ['Hallazgo','Cifra','Periodo','Fuente','Recomendación','Lo que todavía no sabemos']])
    write_csv('5-2','tarjetas_gerente.csv',['numero','pregunta'],[[i+1,s] for i,s in enumerate(['¿De dónde sale ese número?','¿Contra qué periodo lo comparas?','¿Eso lo causó o coincidió?','¿Esto ya lo revisó Calidad?','¿Qué harías el lunes?'])])
    write_csv('5-2','preguntas_recibidas.csv',['ronda','pregunta','respuesta','evidencia','correccion'],[[i+1,'','','',''] for i in range(10)])
    claims=['El scrap de L2 bajó al comparar abril–septiembre de 2025 con octubre de 2025–marzo de 2026.','El turno 3 provoca más scrap.','El operador del turno 3 no está capacitado.','El lote puede liberarse porque el reporte muestra que cumple.','El MTBF del equipo se estima con horas de exposición divididas entre fallas que afectaron producción, dentro del periodo declarado.','Si hacemos preventivo semanal el OEE subirá cinco puntos.','La línea 1 es la más eficiente.','El tablero demuestra formalmente que la acción correctiva fue efectiva.']
    write_csv('5-3','afirmaciones.csv',['numero','afirmacion','categoria_inicial','evidencia_o_limite','categoria_acordada'],[[i+1,s,'','',''] for i,s in enumerate(claims)])
    write_csv('5-3','reescrituras.csv',['afirmacion_original','version_defendible','cifra_periodo_fuente','limite'],[['']*4 for _ in range(3)])
    write_csv('5-4','rubrica.csv',['participante','criterio','nivel_1_a_4','evidencia_observada','pregunta_y_respuesta','pendiente'],[['',s,'','','',''] for s in ['Modelo correcto','Indicadores validados','Diseño legible','Hallazgo sustentado','Manejo de preguntas']])
    write_csv('5-4','entrega.csv',['campo','registro'],[[s,''] for s in ['Archivo y versión','Datos autorizados y fecha de corte','Propietario','Audiencia','Publicación realizada o entrega local','Ubicación autorizada','Actualización y gateway si aplica','RLS probado o pendiente','Limitaciones','Seguimiento a 30 días']])
    print('16 consignas y formularios preparados.')


if __name__=='__main__':main()
