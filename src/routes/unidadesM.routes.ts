import { Router } from "express";
import {
  getUnidadM,
  createUnidadM,
  updateUnidadM,
  deleteUnidadM,
} from "../controllers/unidadesM.controller";

const router = Router();

// Rutas
router.get("/unidadesMedidas", getUnidadM);
router.post("/unidadesMedidas", createUnidadM);
router.put("/unidadesMedidas/:id", updateUnidadM);
router.delete("/unidadesMedidas/:id", deleteUnidadM);

export default router;
