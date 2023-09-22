import express from "express";

const router = express.Router();

import {
  editarProveedor,
  obtenerProveedor,
  nuevoProveedor,
  comprobarProveedor,
  obtenerProveedores,
  comprobarAfip,
  cargarFactura,
  obtenerFacturasaPagar,
  pagarFactura,
} from "../controllers/proveedoresController.js";

import checkAuth from "../middleware/checkAuth.js";

router
  .route("/")
  .get(checkAuth, obtenerProveedores)
  .post(checkAuth, nuevoProveedor);
router.route("/:id").put(checkAuth, editarProveedor);

router.get("/obtener/:id", checkAuth, obtenerProveedor);
router.get("/obtener-facturas", checkAuth, obtenerFacturasaPagar);

router.post("/cargar-factura", checkAuth, cargarFactura);
router.post("/cambiar-estado/:id", checkAuth, pagarFactura);

router.post("/comprobar", checkAuth, comprobarProveedor);
router.post("/comprobarAfip", checkAuth, comprobarAfip);

//TODO: Agregar facturas a los clientes

//TODO: Agregar Recibos a los clientes

//TODO: Agregar Adicionales a los clientes

//TODO: Agregar Usuarios a los clientes

export default router;
