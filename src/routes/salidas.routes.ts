import { Router } from "express";
import {
  getSalidas,
  getSalidasById,
  createSalida,
  updateSalida,
  deleteSalida,
} from "../controllers/salidas_de.controller";
import { authMiddleware } from "../middleware/middleware";

const router = Router();

// Rutas
router.get("/salidas", authMiddleware, getSalidas);
router.get("/salidas/:id", authMiddleware, getSalidasById);
router.post("/salidas", authMiddleware, createSalida);
router.put("/salidas/:id", authMiddleware, updateSalida);
router.delete("/salidas/:id", authMiddleware, deleteSalida);

export default router;
