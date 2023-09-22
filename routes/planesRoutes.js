import express from "express";

const router = express.Router();

import {
  obtenerPlanes,
  nuevoPlan,
  obtenerPlan,
  editarPlan,
} from "../controllers/planesController.js";

import checkAuth from "../middleware/checkAuth.js";

router.route("/").get(checkAuth, obtenerPlanes).post(checkAuth, nuevoPlan);
router.route("/:id").get(checkAuth, obtenerPlan).put(checkAuth, editarPlan);

export default router;
