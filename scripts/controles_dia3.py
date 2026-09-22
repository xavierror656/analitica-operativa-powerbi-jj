"""Control interno del material; no es una actividad de los días 3 o 4.

Contrasta los seis indicadores con agregaciones independientes y controles temporales.
No ejecuta DAX: los resultados esperados se deben comprobar en Desktop durante el pilotaje.
"""
import argparse
import importlib.util
import json
import math
import sqlite3
from datetime import date, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("verificacion", ROOT / "public/descargas/verificar_cifras_dia05.py")
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)


def referencia():
    datos = mod.cargar(ROOT / "public/descargas/dataset-planta-sintetico.zip")
    casos = [("Sin filtros", {}), ("L1", {"linea":"L1"}),
             ("01/03/2025 · L1", {"desde":"2025-03-01","hasta":"2025-03-01","linea":"L1"}),
             ("Turno 1", {"turno":"1"}), ("Ensamble", {"area":"Ensamble"}),
             ("Mayo 2025", {"desde":"2025-05-01","hasta":"2025-05-31"}),
             ("Abril 2025", {"desde":"2025-04-01","hasta":"2025-04-30"})]
    resultados = [{"caso": nombre, "filtros": filtros, "valores": mod.calcular(datos, **filtros)} for nombre, filtros in casos]
    # Contraste adicional con SQL para los numeradores y denominadores.
    db = sqlite3.connect(":memory:")
    db.execute("CREATE TABLE p(fecha TEXT,linea TEXT,turno TEXT,area TEXT,piezas INT,plan INT,buenas INT)")
    db.executemany("INSERT INTO p VALUES(?,?,?,?,?,?,?)", [(f["fecha"],f["linea_id"],f["turno"],datos[2][f["linea_id"]],int(f["piezas_producidas"]),int(f["piezas_plan"]),int(f["piezas_buenas"])) for f in datos[0]])
    for c in resultados:
        where, params = [], []
        for k, v in c["filtros"].items():
            where.append({"desde":"fecha >= ?","hasta":"fecha <= ?","linea":"linea = ?","turno":"turno = ?","area":"area = ?"}[k]); params.append(v)
        sql = "SELECT COUNT(*),SUM(piezas),SUM(plan),SUM(buenas) FROM p" + (" WHERE " + " AND ".join(where) if where else "")
        row = db.execute(sql, params).fetchone()
        assert row == tuple(c["valores"][k] for k in ["filas_produccion","Piezas","Plan","Buenas"])
        assert math.isclose(c["valores"]["% Buenas"] + c["valores"]["% Rechazo producción"], 1)
    mayo, abril = resultados[5]["valores"]["Piezas"], resultados[6]["valores"]["Piezas"]
    corte = date(2025, 5, 7)
    diarios = [mod.calcular(datos, desde=(corte-timedelta(days=n)).isoformat(), hasta=(corte-timedelta(days=n)).isoformat())["Piezas"] or 0 for n in range(7)]
    mtd = sum(diarios)
    assert mtd == mod.calcular(datos, desde="2025-05-01", hasta="2025-05-07")["Piezas"]
    # Casos límite: denominador cero, falta de datos, turno sin efecto en mantenimiento.
    assert mod.calcular(datos, desde="2025-01-01", hasta="2025-01-31")["% Cumplimiento"] is None
    assert resultados[3]["valores"]["Minutos correctivos"] == resultados[0]["valores"]["Minutos correctivos"]
    # Referencia de niveles temporales: datos disponibles ≠ años completos del calendario.
    assert (date(2026,12,31)-date(2025,1,1)).days + 1 == 730
    db.close()
    return {"casos":resultados,"tiempo":{"mayo_2025":mayo,"abril_2025":abril,"variacion_mayo":(mayo-abril)/abril,"mtd_2025_05_07":mtd,"promedio_7d_2025_05_07":mtd/7,"piezas_diarias_01_a_07_mayo":list(reversed(diarios))}}


if __name__ == "__main__":
    parser=argparse.ArgumentParser(description=__doc__); parser.add_argument("--write",action="store_true"); args=parser.parse_args()
    valor=referencia(); ruta=ROOT/"src/data/controles-dia-03.json"
    if args.write:
        ruta.write_text(json.dumps(valor,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    else:
        assert json.loads(ruta.read_text(encoding="utf-8")) == valor, "Controles desactualizados"
    print(json.dumps(valor,ensure_ascii=False,indent=2))
