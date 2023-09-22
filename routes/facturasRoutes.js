import express from "express";

const router = express.Router();

import {
  obtenerFacturas,
  nuevaFactura,
  obtenerFactura,
  editarFactura,
} from "../controllers/facturasController.js";

import checkAuth from "../middleware/checkAuth.js";

router.route("/").get(checkAuth, obtenerFacturas).post(checkAuth, nuevaFactura);
router
  .route("/:id")
  .get(checkAuth, obtenerFactura)
  .put(checkAuth, editarFactura);

export default router;
