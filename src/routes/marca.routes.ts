import { Router } from "express";
import {
  getMarca,
  createMarca,
  updateMarca,
  deleteMarca,
} from "../controllers/marca.controller";
import { authMiddleware } from "../middleware/middleware";

const router = Router();

// Rutas
router.get("/marcas", authMiddleware, getMarca);
router.post("/marcas", authMiddleware, createMarca);
router.put("/marcas/:id", authMiddleware, updateMarca);
router.delete("/marcas/:id", authMiddleware, deleteMarca);

export default router;
