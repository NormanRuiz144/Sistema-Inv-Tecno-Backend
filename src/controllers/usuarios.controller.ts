import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import prisma from "../db/client";

// GET
const getUsuarios = asyncHandler(async (req: Request, res: Response) => {
  const usuarios = await prisma.usuario.findMany();
  if (!usuarios) {
    res.status(404);
    throw new Error("Error al intentar cargar los usuarios.");
  } else {
    res.status(200).json(usuarios);
  }
});
// GET BY ID
const getUsuarioById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const usuario = await prisma.usuario.findFirst({
    where: { id_usuario: Number(id) },
  });
  if (!usuario) {
    res.status(404);
    throw new Error("Usuario no encontrado.");
  } else {
    res.status(200).json(usuario);
  }
});
// POST
const createUsuario = asyncHandler(async (req: Request, res: Response) => {
  const { nombre_usuario, alias_usuario, contrasena_usuario } = req.body;

  //   comprobar alias
  const alias_exits = await prisma.usuario.findFirst({
    where: { alias: alias_usuario },
  });
  if (alias_exits) {
    res.status(400);
    throw new Error("El alias ingresado ya exite.");
  }
  const new_Usuario = await prisma.usuario.create({
    data: {
      nombre: nombre_usuario,
      alias: alias_usuario,
      clave: contrasena_usuario,
    },
  });
  if (new_Usuario) {
    res.status(201).json(new_Usuario);
  }
  res.status(400);
  throw new Error("Error al crear el usuario.");
});
// PUT
const updateUsuario = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre_usuario, alias_usuario, contrasena_usuario } = req.body;

  const usuario_exits = await prisma.usuario.findFirst({
    where: { id_usuario: Number(id) },
  });
  if (!usuario_exits) {
    res.status(400);
    throw new Error("El usuario no existe.");
  }
  const usuario_updated = await prisma.usuario.update({
    where: { id_usuario: Number(id) },
    data: {
      nombre: nombre_usuario || usuario_exits.nombre,
      alias: alias_usuario || usuario_exits.alias,
      clave: contrasena_usuario || usuario_exits.clave,
    },
  });
  //   pa probar xd
  //   console.log(usuario_exits);
  //   console.log(usuario_updated);
  if (usuario_exits !== usuario_updated) {
    res.status(200).json(usuario_updated);
  } else {
    res.status(400);
    throw new Error("Error al actualizar el usuario.");
  }
});

// DELETE
const deleteUsuario = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const UM_exists = await prisma.usuario.findFirst({
    where: { id_usuario: Number(id) },
  });

  if (!UM_exists) {
    res.status(404);
    throw new Error("El usuario no fue encontrado.");
  }

  await prisma.usuario.delete({ where: { id_usuario: Number(id) } });
  res.status(200).json({ message: "Usuario eliminado correctamente." });
});

export {
  getUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
};
