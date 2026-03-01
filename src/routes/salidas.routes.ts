import { Router } from "express";
import {
  getSalidas,
  getSalidasById,
  createSalida,
  updateSalida,
  deleteSalida,
} from "../controllers/salidas_de.controller";

const router = Router();

// Rutas
router.get("/salidas", getSalidas);
router.get("/salidas/:id", getSalidasById);
router.post("/salidas", createSalida);
router.put("/salidas/:id", updateSalida);
router.delete("/salidas/:id", deleteSalida);

export default router;
