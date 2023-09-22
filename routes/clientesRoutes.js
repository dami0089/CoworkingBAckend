import express from "express";

const router = express.Router();

import {
  obtenerClientes,
  nuevoCliente,
  obtenerCliente,
  editarCliente,
  buscarPlan,
  agregarPlan,
  eliminarPlan,
  comprobarCliente,
  obtenerUsuario,
  obtenerPlan,
  editarPlan,
  desactivarCliente,
  obtenerUsuariosProfile,
  asistencias,
  obtenerAsistencias,
  cambiarAsistencias,
  editarAsistencia,
  eliminarAsistencia,
  adicional,
  obtenerAdicionales,
  editarAdicional,
} from "../controllers/clientesController.js";

import checkAuth from "../middleware/checkAuth.js";

router.route("/").get(checkAuth, obtenerClientes).post(checkAuth, nuevoCliente);
router.route("/:id").put(checkAuth, editarCliente);

router.get("/obtener/:id", checkAuth, obtenerCliente);
router.get("/buscar/:id", checkAuth, obtenerUsuario);
router.get("/reset-asistencias", checkAuth, cambiarAsistencias);

router.get("/buscar-prueba/:id", checkAuth, obtenerUsuariosProfile);

//Agregar los planes a los clientes
router.post("/planes", checkAuth, buscarPlan);
router.post("/planes/:id", checkAuth, agregarPlan);
router.post("/adicional", checkAuth, adicional);

router.post("/asistencias/:id", checkAuth, asistencias);
router.post("/editar-asistencia/:id", checkAuth, editarAsistencia);
router.post("/editar-adicional/:id", checkAuth, editarAdicional);

router.get("/obtener-asistencias/:id", checkAuth, obtenerAsistencias);

router.get("/editar-plan/:id", checkAuth, obtenerPlan);
router.get("/obtener-adicionales/:id", checkAuth, obtenerAdicionales);

router.put("/editar-plan/:id", checkAuth, editarPlan);
router.put("/desactivar-activar/:id", checkAuth, desactivarCliente);

router.post("/comprobar", checkAuth, comprobarCliente);

router.delete("/planes/:id'", checkAuth, eliminarPlan);
router.delete("/eliminar-asistencia/:id", checkAuth, eliminarAsistencia);

//TODO: Agregar facturas a los clientes

//TODO: Agregar Recibos a los clientes

//TODO: Agregar Adicionales a los clientes

//TODO: Agregar Usuarios a los clientes

export default router;
