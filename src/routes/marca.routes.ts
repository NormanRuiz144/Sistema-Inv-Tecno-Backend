import { Router } from "express";
import {
  getMarca,
  createMarca,
  updateMarca,
  deleteMarca,
} from "../controllers/marca.controller";

const router = Router();

// Rutas
router.get("/marcas", getMarca);
router.post("/marcas", createMarca);
router.put("/marcas/:id", updateMarca);
router.delete("/marcas/:id", deleteMarca);

export default router;
