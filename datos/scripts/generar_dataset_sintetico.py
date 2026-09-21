"""
Genera el conjunto sintético de planta para "Analítica Operativa con Power BI"
(Johnson & Johnson · Skilling Center Tecmilenio).

Produce las tablas de la Sección 6, Opción A del programa: 18 meses de historia,
4 líneas, 3 turnos, estacionalidad simple, y los defectos de captura que el Día 1
usa para practicar limpieza en Power Query.

Uso:
    python generar_dataset_sintetico.py [--salida ../salida] [--semilla 42]

Para cambiar el reparto (líneas, turnos, partes, meses de historia, tasa de
defectos), edita las constantes en la sección CONFIGURACIÓN.
"""

import argparse
import csv
import random
from datetime import date, timedelta
from pathlib import Path

# ---------------------------------------------------------------------------
# CONFIGURACIÓN
# ---------------------------------------------------------------------------

MESES_HISTORIA = 18
FECHA_FIN = date(2026, 8, 31)

LINEAS = [
    {"linea_id": "L1", "nombre_linea": "Línea 1", "area": "Ensamble", "celda": "C1", "capacidad_hora": 120},
    {"linea_id": "L2", "nombre_linea": "Línea 2", "area": "Ensamble", "celda": "C2", "capacidad_hora": 110},
    {"linea_id": "L3", "nombre_linea": "Línea 3", "area": "Empaque", "celda": "C3", "capacidad_hora": 150},
    {"linea_id": "L4", "nombre_linea": "Línea 4", "area": "Empaque", "celda": "C4", "capacidad_hora": 140},
]

TURNOS = [
    {"turno_id": "T1", "nombre": "1", "hora_inicio": "06:00", "hora_fin": "14:00"},
    {"turno_id": "T2", "nombre": "2", "hora_inicio": "14:00", "hora_fin": "22:00"},
    {"turno_id": "T3", "nombre": "3", "hora_inicio": "22:00", "hora_fin": "06:00"},
]

PARTES = [
    {"parte_id": "P-1001", "descripcion": "Catéter tipo A", "familia": "Catéteres", "estandar_hora": 95, "unidad": "pza"},
    {"parte_id": "P-1002", "descripcion": "Catéter tipo B", "familia": "Catéteres", "estandar_hora": 90, "unidad": "pza"},
    {"parte_id": "P-2001", "descripcion": "Jeringa precargada", "familia": "Jeringas", "estandar_hora": 130, "unidad": "pza"},
    {"parte_id": "P-2002", "descripcion": "Jeringa estándar", "familia": "Jeringas", "estandar_hora": 140, "unidad": "pza"},
    {"parte_id": "P-3001", "descripcion": "Kit de sutura", "familia": "Kits", "estandar_hora": 60, "unidad": "kit"},
]

DEFECTOS = [
    {"defecto_id": "D01", "descripcion": "Sellado incompleto", "categoria": "Empaque", "criticidad": "Mayor"},
    {"defecto_id": "D02", "descripcion": "Etiqueta ilegible", "categoria": "Empaque", "criticidad": "Menor"},
    {"defecto_id": "D03", "descripcion": "Dimensión fuera de tolerancia", "categoria": "Ensamble", "criticidad": "Mayor"},
    {"defecto_id": "D04", "descripcion": "Contaminación visible", "categoria": "Ensamble", "criticidad": "Crítica"},
    {"defecto_id": "D05", "descripcion": "Componente faltante", "categoria": "Ensamble", "criticidad": "Crítica"},
    {"defecto_id": "D06", "descripcion": "Rebaba", "categoria": "Ensamble", "criticidad": "Menor"},
]

EQUIPOS = [
    {"equipo_id": f"{linea['linea_id']}-EQ{n}", "linea_id": linea["linea_id"]}
    for linea in LINEAS
    for n in (1, 2)
]

SUPERVISORES = ["R. Domínguez", "M. Salcido", "A. Prieto"]
INSPECTORES = ["INS-01", "INS-02", "INS-03", "INS-04"]

TASA_PARO_BASE = 0.06          # fracción de horas de operación perdidas en paro no planeado
TASA_RECHAZO_BASE = 0.025      # fracción de piezas producidas que se rechazan
TASA_EVENTOS_MTTO_DIA = 0.35   # probabilidad de un evento de mantenimiento por equipo y día


def rango_fechas(meses: int, fecha_fin: date):
    fecha_inicio = fecha_fin.replace(day=1)
    for _ in range(meses - 1):
        fecha_inicio = (fecha_inicio - timedelta(days=1)).replace(day=1)
    dia = fecha_inicio
    while dia <= fecha_fin:
        yield dia
        dia += timedelta(days=1)


def es_habil(d: date) -> bool:
    return d.weekday() < 6  # domingo descansa, planta corre lunes a sábado


def factor_estacional(d: date) -> float:
    """Baja en diciembre (cierre) y julio (mantenimiento mayor), sube en Q4 salvo diciembre."""
    if d.month == 12:
        return 0.55
    if d.month == 7:
        return 0.8
    if d.month in (10, 11):
        return 1.1
    return 1.0


# ---------------------------------------------------------------------------
# DIMENSIONES
# ---------------------------------------------------------------------------

def escribir_dimensiones(salida: Path):
    with open(salida / "dim_linea.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=["linea_id", "nombre_linea", "area", "celda", "capacidad_hora"])
        w.writeheader()
        w.writerows(LINEAS)

    with open(salida / "dim_parte.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=["parte_id", "descripcion", "familia", "estandar_hora", "unidad"])
        w.writeheader()
        w.writerows(PARTES)

    with open(salida / "dim_turno.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=["turno_id", "nombre", "hora_inicio", "hora_fin"])
        w.writeheader()
        w.writerows(TURNOS)

    with open(salida / "dim_defecto.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=["defecto_id", "descripcion", "categoria", "criticidad"])
        w.writeheader()
        w.writerows(DEFECTOS)

    with open(salida / "dim_calendario.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=[
            "fecha", "anio", "mes", "nombre_mes", "semana_iso", "dia_semana", "es_habil", "periodo_fiscal"
        ])
        w.writeheader()
        nombres_mes = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto",
                       "septiembre", "octubre", "noviembre", "diciembre"]
        dias_semana = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"]
        for d in rango_fechas(MESES_HISTORIA, FECHA_FIN):
            w.writerow({
                "fecha": d.isoformat(),
                "anio": d.year,
                "mes": d.month,
                "nombre_mes": nombres_mes[d.month - 1],
                "semana_iso": d.isocalendar()[1],
                "dia_semana": dias_semana[d.weekday()],
                "es_habil": es_habil(d),
                "periodo_fiscal": f"{d.year}-{(d.month - 1) // 3 + 1}T",
            })


# ---------------------------------------------------------------------------
# HECHOS (con defectos de captura sembrados a propósito, Sección 6 del programa)
# ---------------------------------------------------------------------------

VARIANTES_NOMBRE_LINEA = {
    "L1": ["L1", "Línea 1", "LINEA_1", "linea1"],
    "L2": ["L2", "Línea 2", "LINEA_2", "linea2"],
    "L3": ["L3", "Línea 3", "LINEA_3", "linea3"],
    "L4": ["L4", "Línea 4", "LINEA_4", "linea4"],
}


def generar_produccion_y_calidad(rng: random.Random, salida: Path):
    filas_prod = []
    filas_calidad = []
    lote_seq = 1

    for d in rango_fechas(MESES_HISTORIA, FECHA_FIN):
        if not es_habil(d):
            continue
        estacional = factor_estacional(d)

        for linea in LINEAS:
            for turno in TURNOS:
                # una parte principal por línea/turno/día, ocasionalmente dos
                partes_dia = rng.sample(PARTES, k=1 if rng.random() > 0.25 else 2)

                for parte in partes_dia:
                    piezas_plan = round(linea["capacidad_hora"] * 8 * estacional * rng.uniform(0.85, 1.0))
                    paro_frac = min(0.9, max(0.0, rng.gauss(TASA_PARO_BASE, 0.03)))
                    horas_paro = round(8 * paro_frac, 2)
                    horas_operacion = round(8 - horas_paro, 2)

                    eficiencia = rng.uniform(0.88, 1.02)
                    piezas_producidas = max(0, round(piezas_plan * eficiencia * (horas_operacion / 8)))

                    tasa_rechazo = max(0.0, rng.gauss(TASA_RECHAZO_BASE, 0.01))
                    piezas_rechazadas_total = round(piezas_producidas * tasa_rechazo)
                    piezas_buenas = piezas_producidas - piezas_rechazadas_total

                    lote = f"{d.strftime('%y%m')}-{lote_seq:04d}"
                    lote_seq += 1

                    fecha_str = d.isoformat()
                    linea_str = linea["linea_id"]
                    hora_str = turno["hora_inicio"]
                    turno_str = turno["nombre"]

                    # --- defectos de captura sembrados a propósito ---
                    r = rng.random()
                    if r < 0.05:
                        fecha_str = d.strftime("%d/%m/%Y")  # fecha en texto, formato distinto
                    elif r < 0.08:
                        fecha_str = d.strftime("%m-%d-%Y")

                    linea_str = rng.choice(VARIANTES_NOMBRE_LINEA[linea["linea_id"]]) if rng.random() < 0.15 else linea_str

                    if rng.random() < 0.10:
                        hora_str = _a_formato_12h(turno["hora_inicio"])  # 12h en vez de 24h

                    if rng.random() < 0.06:
                        lote = lote.lstrip("0").replace("-0", "-")  # pierde ceros a la izquierda

                    if rng.random() < 0.04:
                        turno_str = rng.choice(SUPERVISORES)  # nombre de supervisor en vez de número

                    horas_paro_out = "" if rng.random() < 0.03 else horas_paro  # celda vacía vs cero real

                    filas_prod.append({
                        "fecha": fecha_str,
                        "turno": turno_str,
                        "hora_inicio": hora_str,
                        "linea_id": linea_str,
                        "parte_id": parte["parte_id"],
                        "lote": lote,
                        "piezas_plan": piezas_plan,
                        "piezas_producidas": piezas_producidas,
                        "piezas_buenas": piezas_buenas,
                        "horas_operacion": horas_operacion,
                        "horas_paro": horas_paro_out,
                    })

                    # duplicado ocasional por doble captura de fin de turno
                    if rng.random() < 0.015:
                        filas_prod.append(dict(filas_prod[-1]))

                    # eventos de calidad ligados a este lote
                    piezas_restantes = piezas_rechazadas_total
                    while piezas_restantes > 0:
                        defecto = rng.choice(DEFECTOS)
                        cantidad = min(piezas_restantes, rng.randint(1, max(1, piezas_rechazadas_total // 2 + 1)))
                        piezas_restantes -= cantidad

                        codigo_defecto = defecto["defecto_id"]
                        if rng.random() < 0.08:
                            codigo_defecto = codigo_defecto + "  "  # espacios al final

                        filas_calidad.append({
                            "fecha": d.isoformat(),
                            "linea_id": linea["linea_id"],
                            "parte_id": parte["parte_id"],
                            "lote": lote,
                            "tipo_defecto": codigo_defecto,
                            "etapa_deteccion": rng.choice(["En línea", "Inspección final", "Cuarentena"]),
                            "piezas_rechazadas": cantidad,
                            "disposicion": rng.choice(["Retrabajo", "Desecho", "Concesión"]),
                            "inspector_id": rng.choice(INSPECTORES),
                        })

        # fila de subtotal embebida, una vez cada tantos días (defecto de captura)
        if rng.random() < 0.03 and filas_prod:
            filas_prod.append({
                "fecha": d.isoformat(),
                "turno": "Total día",
                "linea_id": "",
                "parte_id": "",
                "lote": "",
                "piezas_plan": "",
                "piezas_producidas": sum(
                    f["piezas_producidas"] for f in filas_prod
                    if f["fecha"] == d.isoformat() and isinstance(f["piezas_producidas"], int)
                ),
                "piezas_buenas": "",
                "horas_operacion": "",
                "horas_paro": "",
                "hora_inicio": "",
            })

    _escribir_csv(salida / "fact_produccion.csv", filas_prod,
                  ["fecha", "turno", "hora_inicio", "linea_id", "parte_id", "lote", "piezas_plan",
                   "piezas_producidas", "piezas_buenas", "horas_operacion", "horas_paro"])
    _escribir_csv(salida / "fact_calidad.csv", filas_calidad,
                  ["fecha", "linea_id", "parte_id", "lote", "tipo_defecto", "etapa_deteccion",
                   "piezas_rechazadas", "disposicion", "inspector_id"])


def generar_mantenimiento(rng: random.Random, salida: Path):
    filas = []
    for d in rango_fechas(MESES_HISTORIA, FECHA_FIN):
        if not es_habil(d):
            continue
        for equipo in EQUIPOS:
            if rng.random() < TASA_EVENTOS_MTTO_DIA:
                tipo = rng.choices(["preventivo", "correctivo"], weights=[0.6, 0.4])[0]
                duracion = round(rng.uniform(15, 45) if tipo == "preventivo" else rng.uniform(20, 240))
                filas.append({
                    "fecha_evento": d.isoformat(),
                    "equipo_id": equipo["equipo_id"],
                    "linea_id": equipo["linea_id"],
                    "tipo": tipo,
                    "duracion_min": duracion,
                    "causa": rng.choice([
                        "Desgaste normal", "Falla eléctrica", "Falla mecánica",
                        "Ajuste de calibración", "Falta de lubricación", "Sensor descalibrado",
                    ]),
                    "afecta_produccion": tipo == "correctivo" and duracion > 30,
                })
    _escribir_csv(salida / "fact_mantenimiento.csv", filas,
                  ["fecha_evento", "equipo_id", "linea_id", "tipo", "duracion_min", "causa", "afecta_produccion"])


def _a_formato_12h(hora_24: str) -> str:
    h, m = hora_24.split(":")
    h = int(h)
    sufijo = "a.m." if h < 12 else "p.m."
    h12 = h % 12
    h12 = 12 if h12 == 0 else h12
    return f"{h12}:{m} {sufijo}"


def _escribir_csv(ruta: Path, filas: list, columnas: list):
    with open(ruta, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=columnas)
        w.writeheader()
        w.writerows(filas)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--salida", default="../salida", help="Carpeta de salida para los CSV")
    parser.add_argument("--semilla", type=int, default=42, help="Semilla aleatoria, para reproducibilidad")
    args = parser.parse_args()

    salida = (Path(__file__).parent / args.salida).resolve()
    salida.mkdir(parents=True, exist_ok=True)

    rng = random.Random(args.semilla)

    escribir_dimensiones(salida)
    generar_produccion_y_calidad(rng, salida)
    generar_mantenimiento(rng, salida)

    print(f"Dataset generado en: {salida}")
    for csv_file in sorted(salida.glob("*.csv")):
        with open(csv_file, encoding="utf-8") as f:
            n = sum(1 for _ in f) - 1
        print(f"  {csv_file.name}: {n} filas")


if __name__ == "__main__":
    main()
