import express from "express";

const router = express.Router();

import {
  obtenerRubros,
  nuevoRubro,
  editarRubro,
} from "../controllers/rubrosController.js";

import checkAuth from "../middleware/checkAuth.js";

router.route("/").get(checkAuth, obtenerRubros).post(checkAuth, nuevoRubro);
router.route("/:id").put(checkAuth, editarRubro);

export default router;
