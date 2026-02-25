import { Router } from "express";
import {
  getEntradas_Detalles,
  getEntradasById,
  createEntrada,
  updateEntrada,
  deleteEntrada,
} from "../controllers/entradas_de.controller";

const router = Router();

// Rutas
router.get("/entradas", getEntradas_Detalles);
router.get("/entradas/:id", getEntradasById);
router.post("/entradas", createEntrada);
router.put("/entradas/:id", updateEntrada);
router.delete("/entradas/:id", deleteEntrada);

export default router;
