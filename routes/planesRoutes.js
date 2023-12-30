import express from "express";

const router = express.Router();

import {
  obtenerPlanes,
  nuevoPlan,
  obtenerPlan,
  editarPlan,
  eliminarPlan,
} from "../controllers/planesController.js";

import checkAuth from "../middleware/checkAuth.js";

router.route("/").get(checkAuth, obtenerPlanes).post(checkAuth, nuevoPlan);
router.route("/:id").get(checkAuth, obtenerPlan).put(checkAuth, editarPlan);

router.post("/eliminar-plan/:id", checkAuth, eliminarPlan);

export default router;
