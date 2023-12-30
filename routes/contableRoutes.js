import express from "express";

const router = express.Router();

import {
  obtenerMovimientos,
  nuevoMovimiento,
  editarMovimiento,
  obtenerMovimiento,
  eliminarMovimiento,
  nuevoPagoCliente,
  obtenerMovimientosPorMesYAno,
  obtenerTotalesDashboard,
  obtenerResumenPorEntidad,
  obtenerResumenPorMesYEntidad,
} from "../controllers/contableController.js";

import checkAuth from "../middleware/checkAuth.js";

router.post("/", checkAuth, nuevoMovimiento);
router.get("/obtener/:id", checkAuth, obtenerMovimiento);
router.route("/:id").put(checkAuth, editarMovimiento);
router.delete("/planes/:id'", checkAuth, eliminarMovimiento);

router.post("/pago-cliente", checkAuth, nuevoPagoCliente);

router.post("/obtener-movimientos-entidad", checkAuth, obtenerMovimientos);

router.post("/filtrar-movimientos", checkAuth, obtenerMovimientosPorMesYAno);

router.get("/obtener-dash-contable", checkAuth, obtenerTotalesDashboard);

router.post(
  "/obtener-dash-contable-entidad/:entidad",
  checkAuth,
  obtenerResumenPorEntidad
);

router.post(
  "/obtener-dash-contable-entidad-filtrado/",
  checkAuth,
  obtenerResumenPorMesYEntidad
);

export default router;
