"""Controles de A2 derivados del ZIP original. No ejecuta el motor de Power BI.

python scripts/verificar_dia2.py          # valida referencia y tiempos
python scripts/verificar_dia2.py --write  # regenera la referencia tras un cambio deliberado
"""
import argparse
import csv
import hashlib
import io
import json
import re
import sqlite3
import zipfile
from datetime import date, datetime, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def controles():
    ruta = ROOT / "public/descargas/dataset-planta-sintetico.zip"
    with zipfile.ZipFile(ruta) as z:
        tablas = {Path(n).stem: list(csv.DictReader(io.StringIO(z.read(n).decode("utf-8-sig")))) for n in z.namelist()}
    vistos, produccion = set(), []
    for fila in tablas["fact_produccion"]:
        clave = tuple(fila.values())
        if fila["turno"] == "Total día" or clave in vistos:
            continue
        vistos.add(clave)
        fila = dict(fila)
        fecha = fila["fecha"]
        fmt = "%d/%m/%Y" if "/" in fecha else "%Y-%m-%d" if len(fecha.split("-")[0]) == 4 else "%m-%d-%Y"
        fila["fecha"] = datetime.strptime(fecha, fmt).date().isoformat()
        fila["linea_id"] = fila["linea_id"].lower().replace("í", "i").replace("_", "").replace(" ", "").replace("linea", "L").upper()
        hora = fila["hora_inicio"].replace("a.m.", "AM").replace("p.m.", "PM")
        hora = datetime.strptime(hora, "%I:%M %p" if "M" in hora else "%H:%M").strftime("%H:%M")
        if fila["turno"] not in {"1", "2", "3"}:
            fila["turno"] = {"06:00": "1", "14:00": "2", "22:00": "3"}[hora]
        produccion.append(fila)
    tablas["fact_produccion"] = produccion
    for nombre in ["fact_produccion", "fact_calidad"]:
        for fila in tablas[nombre]:
            prefijo, sufijo = fila["lote"].split("-")
            fila["lote"] = prefijo + "-" + sufijo.zfill(4)
    for fila in tablas["fact_calidad"]:
        fila["tipo_defecto"] = fila["tipo_defecto"].strip()
    contrato = json.loads((ROOT / "src/data/modelo-dia-02.json").read_text(encoding="utf-8"))
    assert len(contrato["relaciones"]) == 10
    assert contrato["cardinalidad"] == "1:*" and contrato["activas"] is True
    for dim, pk, fact, fk in contrato["relaciones"]:
        claves = [f[pk] for f in tablas[dim]]
        assert all(claves) and len(set(claves)) == len(claves), f"Clave no única: {dim}[{pk}]"
        huerfanas = {f[fk] for f in tablas[fact]} - set(claves)
        assert not huerfanas, f"Claves huérfanas en {fact}[{fk}]: {huerfanas}"
    fechas = sorted(f["fecha"] for f in tablas["dim_calendario"])
    inicio, fin = date.fromisoformat(fechas[0]), date.fromisoformat(fechas[-1])
    assert fechas == [(inicio + timedelta(days=n)).isoformat() for n in range((fin-inicio).days+1)]

    # SQL independiente para verificar que unir cada hecho a sus dimensiones
    # conserva la granularidad. El PBIX se verifica después en Desktop.
    db = sqlite3.connect(":memory:")
    for nombre, filas in tablas.items():
        columnas = list(filas[0])
        db.execute(f'CREATE TABLE "{nombre}" (' + ','.join(f'"{c}" TEXT' for c in columnas) + ')')
        db.executemany(f'INSERT INTO "{nombre}" VALUES (' + ','.join('?' for _ in columnas) + ')', [list(f.values()) for f in filas])
    metricas = {"fact_produccion": "piezas_producidas", "fact_calidad": "piezas_rechazadas", "fact_mantenimiento": "duracion_min"}
    casos = [
        ("Sin filtros", {}),
        ("Línea L1", {"dim_linea.linea_id": "L1"}),
        ("2025-03-01 · L1", {"dim_calendario.fecha": "2025-03-01", "dim_linea.linea_id": "L1"}),
        ("Turno 1", {"dim_turno.nombre": "1"}),
        ("Parte P-1001", {"dim_parte.parte_id": "P-1001"}),
        ("Defecto D01", {"dim_defecto.defecto_id": "D01"}),
    ]
    resultado = []
    for etiqueta, filtros in casos:
        valores = {}
        for fact, metrica in metricas.items():
            relaciones = [r for r in contrato["relaciones"] if r[2] == fact]
            consulta = f'SELECT COUNT(*), COALESCE(SUM(CAST(f."{metrica}" AS INTEGER)),0) FROM "{fact}" f '
            consulta += ' '.join(f'JOIN "{dim}" ON "{dim}"."{pk}" = f."{fk}"' for dim, pk, _, fk in relaciones)
            condiciones, parametros = [], []
            for campo, valor in filtros.items():
                dim, columna = campo.split('.')
                if any(r[0] == dim for r in relaciones):
                    condiciones.append(f'"{dim}"."{columna}" = ?')
                    parametros.append(valor)
            if condiciones:
                consulta += ' WHERE ' + ' AND '.join(condiciones)
            cantidad, total = db.execute(consulta, parametros).fetchone()
            if not filtros:
                assert cantidad == len(tablas[fact])
                assert total == sum(int(f[metrica]) for f in tablas[fact])
            valores[fact] = {"filas": cantidad, "total": total, "unidad": "min" if fact.endswith("mantenimiento") else "piezas"}
        resultado.append({"caso": etiqueta, "filtros": filtros, "valores": valores})
    # Las dimensiones no relacionadas no filtran otros hechos.
    assert resultado[3]["valores"]["fact_calidad"] == resultado[0]["valores"]["fact_calidad"]
    assert resultado[4]["valores"]["fact_mantenimiento"] == resultado[0]["valores"]["fact_mantenimiento"]
    assert resultado[5]["valores"]["fact_produccion"] == resultado[0]["valores"]["fact_produccion"]
    db.close()
    return {"zip_sha256": hashlib.sha256(ruta.read_bytes()).hexdigest(), "calendario": {"filas": len(fechas), "desde": fechas[0], "hasta": fechas[-1]}, "casos": resultado}


def tiempos():
    pagina = ROOT / "src/pages/dia-02.astro"
    texto = pagina.read_text(encoding="utf-8")
    imports = dict(re.findall(r"import (\w+) from '(.*?)';", texto))
    bloques = []
    for bloque in texto.split("<!--")[1:]:
        duracion = 0
        nombres = re.findall(r"<(M\w+)\s*/>", bloque)
        for nombre in nombres:
            contenido = (pagina.parent / imports[nombre]).read_text(encoding="utf-8")
            notas = re.findall(r"<Notas\b[\s\S]*?minutos=\{(\d+)\}", contenido)
            assert len(notas) == 1, nombre
            duracion += int(notas[0])
            actividad = re.search(r"<(?:TuTurno|Practica)\b[\s\S]*?minutos=\{(\d+)\}", contenido)
            if actividad:
                assert actividad[1] == notas[0], nombre
        bloques.append(duracion)
    assert bloques == [60,90,90,90,90,30], bloques
    return bloques


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--write", action="store_true")
    args = parser.parse_args()
    valor = controles()
    destino = ROOT / "src/data/controles-dia-02.json"
    if args.write:
        destino.write_text(json.dumps(valor, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    else:
        assert json.loads(destino.read_text(encoding="utf-8")) == valor, "Referencia desactualizada"
        print("Minutos por bloque:", tiempos())
    print(json.dumps(valor, ensure_ascii=False, indent=2))
