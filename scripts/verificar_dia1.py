"""Verifica el ZIP distribuido y los minutos del día 1, sin modificar los datos.

Ejecutar desde cualquier carpeta: python scripts/verificar_dia1.py
No sustituye una ejecución de las consultas M en Power BI Desktop.
"""
import csv
import hashlib
import io
import json
import re
import zipfile
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def verificar():
    dataset = ROOT / "public/descargas/dataset-planta-sintetico.zip"
    with zipfile.ZipFile(dataset) as archivo:
        tablas = {
            nombre: list(csv.DictReader(io.StringIO(archivo.read(nombre).decode("utf-8-sig"))))
            for nombre in archivo.namelist()
        }
    assert set(tablas) == {
        "fact_produccion.csv", "fact_calidad.csv", "fact_mantenimiento.csv",
        "dim_linea.csv", "dim_parte.csv", "dim_turno.csv", "dim_defecto.csv", "dim_calendario.csv",
    }, "El ZIP debe contener exactamente las ocho tablas del curso"
    origen = tablas["fact_produccion.csv"]
    subtotales, duplicados, salida = [], [], []
    vistos = set()
    for fila in origen:
        if fila["turno"] == "Total día":
            subtotales.append(fila)
            continue
        clave = tuple(fila.values())
        if clave in vistos:
            duplicados.append(fila)
        else:
            vistos.add(clave)
            salida.append(fila)

    def piezas(filas):
        return sum(int(f["piezas_producidas"]) for f in filas)

    assert len(origen) == len(salida) + len(subtotales) + len(duplicados)
    assert piezas(origen) == piezas(salida) + piezas(subtotales) + piezas(duplicados)
    calendario = {f["fecha"] for f in tablas["dim_calendario.csv"]}
    lineas = {f["linea_id"] for f in tablas["dim_linea.csv"]}
    turnos = {f["hora_inicio"]: f["nombre"] for f in tablas["dim_turno.csv"]}
    formatos = set()
    turnos_recuperados = 0
    lotes_prod = set()
    piezas_por_lote = {}
    for fila in salida:
        fecha = fila["fecha"]
        formato = "%d/%m/%Y" if "/" in fecha else "%Y-%m-%d" if len(fecha.split("-")[0]) == 4 else "%m-%d-%Y"
        formatos.add(formato)
        assert datetime.strptime(fecha, formato).date().isoformat() in calendario
        linea = fila["linea_id"].lower().replace("í", "i").replace("_", "").replace(" ", "").replace("linea", "L").upper()
        assert linea in lineas
        hora = fila["hora_inicio"].replace("a.m.", "AM").replace("p.m.", "PM")
        hora = datetime.strptime(hora, "%I:%M %p" if "M" in hora else "%H:%M").strftime("%H:%M")
        assert hora in turnos
        if fila["turno"] not in {"1", "2", "3"}:
            turnos_recuperados += 1
        else:
            assert fila["turno"] == turnos[hora]
        prefijo, sufijo = fila["lote"].split("-")
        lote = f"{prefijo}-{sufijo.zfill(4)}"
        assert re.fullmatch(r"\d{4}-\d{4}", lote)
        assert lote not in lotes_prod, "Lote inesperadamente repetido en el detalle depurado"
        lotes_prod.add(lote)
        producido, bueno = int(fila["piezas_producidas"]), int(fila["piezas_buenas"])
        assert 0 <= bueno <= producido
        piezas_por_lote[lote] = producido - bueno
    assert len(formatos) == 3
    rechazos = {}
    defectos = {f["defecto_id"] for f in tablas["dim_defecto.csv"]}
    for fila in tablas["fact_calidad.csv"]:
        prefijo, sufijo = fila["lote"].split("-")
        lote = f"{prefijo}-{sufijo.zfill(4)}"
        assert lote in lotes_prod
        assert fila["tipo_defecto"].strip() in defectos
        rechazos[lote] = rechazos.get(lote, 0) + int(fila["piezas_rechazadas"])
    assert all(rechazos.get(lote, 0) == cantidad for lote, cantidad in piezas_por_lote.items())

    pagina = ROOT / "src/pages/dia-01.astro"
    texto = pagina.read_text(encoding="utf-8")
    imports = dict(re.findall(r"import (\w+) from '(.*?)';", texto))
    bloques = []
    esperados = [60, 90, 90, 90, 90, 30]
    for bloque in texto.split("<!--")[1:]:
        etiqueta = bloque.split("-->")[0].strip()
        componentes = re.findall(r"<(M\w+)\s*/>", bloque)
        duracion = 0
        for nombre in componentes:
            contenido = (pagina.parent / imports[nombre]).read_text(encoding="utf-8")
            notas = re.findall(r"<Notas\b[\s\S]*?minutos=\{(\d+)\}", contenido)
            assert len(notas) == 1, f"Revisar notas de {nombre}"
            duracion += int(notas[0])
            actividad = re.search(r"<(?:TuTurno|Practica)\b[\s\S]*?minutos=\{(\d+)\}", contenido)
            if actividad:
                assert actividad[1] == notas[0], f"Cronómetro y notas difieren en {nombre}"
        bloques.append({"bloque": etiqueta, "modulos": len(componentes), "minutos": duracion})
    assert [b["minutos"] for b in bloques[:6]] == esperados
    assert sum(b["minutos"] for b in bloques[:6]) == 450
    return {
        "zip_sha256": hashlib.sha256(dataset.read_bytes()).hexdigest(),
        "filas_por_tabla": {n: len(f) for n, f in tablas.items()},
        "conciliacion_produccion": {
            nombre: {"filas": len(filas), "piezas": piezas(filas)}
            for nombre, filas in [("origen", origen), ("subtotales", subtotales), ("duplicados", duplicados), ("salida", salida)]
        },
        "nulos_horas_paro_salida": sum(f["horas_paro"] == "" for f in salida),
        "turnos_recuperables_por_hora": turnos_recuperados,
        "rechazos_conciliados_por_lote": sum(rechazos.values()),
        "bloques": bloques,
    }


if __name__ == "__main__":
    print(json.dumps(verificar(), ensure_ascii=False, indent=2))
