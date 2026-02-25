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

const router = Router();

router.post("/usuarios/login", loginUsuario);
router.post("/usuarios/logout", logoutUsuario);

router.get("/usuarios", getUsuarios);
router.get("/usuarios/:id", getUsuarioById);
router.post("/usuarios", createUsuario);
router.put("/usuarios/:id", updateUsuario);
router.delete("/usuarios/:id", deleteUsuario);

export default router;
