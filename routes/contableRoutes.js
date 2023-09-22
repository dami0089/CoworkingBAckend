import express from "express";

const router = express.Router();

import {
  obtenerMovimientos,
  nuevoMovimiento,
  editarMovimiento,
  obtenerMovimiento,
  eliminarMovimiento,
} from "../controllers/contableController.js";

import checkAuth from "../middleware/checkAuth.js";

router
  .route("/")
  .get(checkAuth, obtenerMovimientos)
  .post(checkAuth, nuevoMovimiento);
router.get("/obtener/:id", checkAuth, obtenerMovimiento);
router.route("/:id").put(checkAuth, editarMovimiento);
router.delete("/planes/:id'", checkAuth, eliminarMovimiento);

//TODO: Agregar facturas a los clientes

//TODO: Agregar Recibos a los clientes

//TODO: Agregar Adicionales a los clientes

//TODO: Agregar Usuarios a los clientes

export default router;
