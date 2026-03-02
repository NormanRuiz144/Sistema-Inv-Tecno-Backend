import { Router } from "express";
import {
  getProductos,
  getProductoById,
  getProductoByCodigo,
  createProducto,
  updateProducto,
  deleteProducto,
} from "../controllers/productos.controller";
import { authMiddleware } from "../middleware/middleware";

const router = Router();

router.get("/productos", authMiddleware, getProductos);
router.get("/productos/:id", authMiddleware, getProductoById);
router.post("/productos/codigo", authMiddleware, getProductoByCodigo);
router.post("/productos", authMiddleware, createProducto);
router.put("/productos/:id", authMiddleware, updateProducto);
router.delete("/productos/:id", authMiddleware, deleteProducto);

export default router;
