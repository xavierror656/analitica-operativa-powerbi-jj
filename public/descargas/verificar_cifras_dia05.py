"""Día 5: verificación externa del dataset sintético del curso.

Requiere Python 3; usa solamente su biblioteca estándar. No modifica el ZIP.
Ejemplo: python verificar_cifras_dia05.py dataset-planta-sintetico.zip --linea L1
Las reglas implementan A1. No leen el PBIX ni evalúan DAX.
"""
import argparse
import csv
import hashlib
import io
import json
import zipfile
from datetime import datetime
from pathlib import Path

SHA_REFERENCIA = "9948728716b3fc15bfc6d4d89b5ec347eb2d8c601da68afb8bca943f18bc2ce8"


def cargar(ruta):
    with zipfile.ZipFile(ruta) as archivo:
        def leer(nombre):
            return list(csv.DictReader(io.StringIO(archivo.read(nombre).decode("utf-8-sig"))))
        originales = leer("fact_produccion.csv")
        mantenimiento = leer("fact_mantenimiento.csv")
        lineas = {f["linea_id"]: f["area"] for f in leer("dim_linea.csv")}
    vistos, produccion = set(), []
    for original in originales:
        if original["turno"] == "Total día":
            continue
        clave = tuple(original.values())
        if clave in vistos:
            continue
        vistos.add(clave)
        fila = dict(original)
        fecha = fila["fecha"]
        formato = "%d/%m/%Y" if "/" in fecha else "%Y-%m-%d" if len(fecha.split("-")[0]) == 4 else "%m-%d-%Y"
        fila["fecha"] = datetime.strptime(fecha, formato).date().isoformat()
        fila["linea_id"] = fila["linea_id"].lower().replace("í", "i").replace("_", "").replace(" ", "").replace("linea", "L").upper()
        if fila["linea_id"] not in lineas:
            raise ValueError("Línea sin catálogo: " + fila["linea_id"])
        if fila["turno"] not in {"1", "2", "3"}:
            hora = fila["hora_inicio"].replace("a.m.", "AM").replace("p.m.", "PM")
            hora = datetime.strptime(hora, "%I:%M %p" if "M" in hora else "%H:%M").strftime("%H:%M")
            fila["turno"] = {"06:00": "1", "14:00": "2", "22:00": "3"}[hora]
        produccion.append(fila)
    return produccion, mantenimiento, lineas


def calcular(datos, desde=None, hasta=None, linea=None, turno=None, area=None):
    produccion, mantenimiento, lineas = datos
    def coincide(f, campo_fecha):
        return ((desde is None or f[campo_fecha] >= desde)
                and (hasta is None or f[campo_fecha] <= hasta)
                and (linea is None or f["linea_id"] == linea)
                and (area is None or lineas[f["linea_id"]] == area))
    p = [f for f in produccion if coincide(f, "fecha") and (turno is None or f["turno"] == turno)]
    # Turno NO filtra mantenimiento: esa clave no existe en el modelo base.
    m = [f for f in mantenimiento if coincide(f, "fecha_evento") and f["tipo"] == "correctivo"]
    piezas = sum(int(f["piezas_producidas"]) for f in p) if p else None
    plan = sum(int(f["piezas_plan"]) for f in p) if p else None
    buenas = sum(int(f["piezas_buenas"]) for f in p) if p else None
    def razon(numerador, denominador):
        return numerador / denominador if numerador is not None and denominador else None
    return {
        "filas_produccion": len(p), "Piezas": piezas, "Plan": plan, "Buenas": buenas,
        "% Cumplimiento": razon(piezas, plan),
        "% Buenas": razon(buenas, piezas),
        "% Rechazo producción": razon(piezas - buenas if p else None, piezas),
        "Eventos correctivos": len(m) if m else None,
        "Minutos correctivos": sum(int(f["duracion_min"]) for f in m) if m else None,
    }


def fecha_iso(texto):
    try:
        fecha = datetime.strptime(texto, "%Y-%m-%d").date()
        if fecha.isoformat() != texto:
            raise ValueError()
        return texto
    except ValueError as error:
        raise argparse.ArgumentTypeError("Usa fecha AAAA-MM-DD") from error


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("zip", type=Path)
    parser.add_argument("--desde", type=fecha_iso)
    parser.add_argument("--hasta", type=fecha_iso)
    parser.add_argument("--linea", choices=["L1", "L2", "L3", "L4"])
    parser.add_argument("--turno", choices=["1", "2", "3"])
    parser.add_argument("--area", choices=["Ensamble", "Empaque"])
    args = parser.parse_args()
    if args.desde and args.hasta and args.desde > args.hasta:
        parser.error("La fecha inicial debe ser anterior o igual a la final")
    if not args.zip.is_file():
        parser.error("No se encontró el ZIP indicado")
    try:
        datos = cargar(args.zip)
        resultado = calcular(datos, args.desde, args.hasta, args.linea, args.turno, args.area)
    except (ValueError, KeyError, OSError, zipfile.BadZipFile) as error:
        parser.error("No se pudo verificar el dataset: " + str(error))
    salida = {
        "dataset_referencia": hashlib.sha256(args.zip.read_bytes()).hexdigest() == SHA_REFERENCIA,
        "filtros": {k: getattr(args, k) for k in ["desde", "hasta", "linea", "turno", "area"]},
        "alcance": "Turno solo filtra producción. Razones en escala 0–1; null significa sin datos o sin denominador.",
        "resultados": resultado,
    }
    print(json.dumps(salida, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
