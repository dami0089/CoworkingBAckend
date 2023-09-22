import express from "express";

const router = express.Router();

import {
  crearReserva,
  verificarDisponibilidad,
  obtenerReservasSalaMadrid,
  obtenerReservasSalaAmsterdam,
  obtenerReservasSalaParis,
  obtenerReservasSalaCabina,
  obtenerReservasSalaBsAs,
} from "../controllers/salasController.js";

import checkAuth from "../middleware/checkAuth.js";

router.post("/verificar-disponibilidad", checkAuth, verificarDisponibilidad);
router.post("/crear-reserva/:id", checkAuth, crearReserva);
router.post("/reservas-sala-madrid", checkAuth, obtenerReservasSalaMadrid);
router.post(
  "/reservas-sala-amsterdam",
  checkAuth,
  obtenerReservasSalaAmsterdam
);
router.post("/reservas-sala-paris", checkAuth, obtenerReservasSalaParis);
router.post("/reservas-sala-cabina", checkAuth, obtenerReservasSalaCabina);
router.post("/reservas-sala-bsas", checkAuth, obtenerReservasSalaBsAs);

export default router;
