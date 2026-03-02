import { Router } from "express";
import {
  getUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  loginUsuario,
  logoutUsuario,
} from "../controllers/usuarios.controller";
import { authMiddleware } from "../middleware/middleware";

const router = Router();

router.post("/usuarios/login", loginUsuario);
router.post("/usuarios/logout", logoutUsuario);

router.get("/usuarios", authMiddleware, getUsuarios);
router.get("/usuarios/:id", authMiddleware, getUsuarioById);
router.post("/usuarios", authMiddleware, createUsuario);
router.put("/usuarios/:id", authMiddleware, updateUsuario);
router.delete("/usuarios/:id", authMiddleware, deleteUsuario);

export default router;
