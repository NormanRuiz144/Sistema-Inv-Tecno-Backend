import { Router } from "express";
import {
  getEntradas_Detalles,
  getEntradasById,
  createEntrada,
  updateEntrada,
  deleteEntrada,
} from "../controllers/entradas_de.controller";
import { authMiddleware } from "../middleware/middleware";

const router = Router();

// Rutas
router.get("/entradas", authMiddleware, getEntradas_Detalles);
router.get("/entradas/:id", authMiddleware, getEntradasById);
router.post("/entradas", authMiddleware, createEntrada);
router.put("/entradas/:id", authMiddleware, updateEntrada);
router.delete("/entradas/:id", authMiddleware, deleteEntrada);

export default router;
