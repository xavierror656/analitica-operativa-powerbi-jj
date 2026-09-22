"""Pruebas internas; no constituyen actividades previas al Día 5."""
import hashlib
import importlib.util
import json
import subprocess
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "public/descargas/verificar_cifras_dia05.py"
ZIP = ROOT / "public/descargas/dataset-planta-sintetico.zip"
spec = importlib.util.spec_from_file_location("verificador", SCRIPT)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)


class VerificadorTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.datos = mod.cargar(ZIP)

    def test_mayo_cli_sin_modificar_fuente(self):
        antes = hashlib.sha256(ZIP.read_bytes()).hexdigest()
        result = subprocess.run([sys.executable, "-X", "utf8", str(SCRIPT), str(ZIP), "--desde", "2025-05-01", "--hasta", "2025-05-31"], capture_output=True, text=True, encoding="utf-8")
        self.assertEqual(result.returncode, 0, result.stderr)
        value = json.loads(result.stdout)
        self.assertTrue(value["dataset_referencia"])
        self.assertEqual(value["resultados"]["Piezas"], 337491)
        self.assertEqual(value["resultados"]["Plan"], 377764)
        self.assertEqual(value["resultados"]["Minutos correctivos"], 3298)
        self.assertEqual(hashlib.sha256(ZIP.read_bytes()).hexdigest(), antes)

    def test_filtro_turno_no_se_inventa_para_mantenimiento(self):
        base = mod.calcular(self.datos)
        turno = mod.calcular(self.datos, turno="1")
        self.assertEqual(turno["Piezas"], 1954605)
        self.assertNotEqual(turno["Piezas"], base["Piezas"])
        self.assertEqual(turno["Minutos correctivos"], base["Minutos correctivos"])

    def test_vacios_y_preventivo_no_son_correctivo_cero(self):
        vacio = mod.calcular(self.datos, desde="2025-01-01", hasta="2025-01-31")
        self.assertIsNone(vacio["Piezas"])
        self.assertIsNone(vacio["% Cumplimiento"])
        preventivo = mod.calcular(self.datos, desde="2025-03-01", hasta="2025-03-01", linea="L1")
        self.assertEqual(preventivo["Piezas"], 2301)
        self.assertIsNone(preventivo["Minutos correctivos"])

    def test_razon_ponderada_y_plan_cero(self):
        def fila(piezas, buenas):
            return dict(fecha="2025-05-01", linea_id="L1", turno="1", piezas_producidas=str(piezas), piezas_buenas=str(buenas), piezas_plan="0")
        resultado = mod.calcular(([fila(100, 95), fila(900, 891)], [], {"L1": "Ensamble"}))
        self.assertAlmostEqual(resultado["% Rechazo producción"], 0.014)
        self.assertIsNone(resultado["% Cumplimiento"])

    def test_fechas_invalidas_rechazadas(self):
        for args in [["--desde", "2025-02-30"], ["--desde", "2025-5-1"], ["--desde", "2025-05-31", "--hasta", "2025-05-01"]]:
            with self.subTest(args=args):
                result = subprocess.run([sys.executable, str(SCRIPT), str(ZIP), *args], capture_output=True)
                self.assertEqual(result.returncode, 2)


if __name__ == "__main__":
    unittest.main()
