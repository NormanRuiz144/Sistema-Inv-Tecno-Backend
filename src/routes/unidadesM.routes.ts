import { Router } from "express";
import {
  getUnidadM,
  createUnidadM,
  updateUnidadM,
  deleteUnidadM,
} from "../controllers/unidadesM.controller";
import { authMiddleware } from "../middleware/middleware";

const router = Router();

// Rutas
router.get("/unidadesMedidas", authMiddleware, getUnidadM);
router.post("/unidadesMedidas", authMiddleware, createUnidadM);
router.put("/unidadesMedidas/:id", authMiddleware, updateUnidadM);
router.delete("/unidadesMedidas/:id", authMiddleware, deleteUnidadM);

export default router;
