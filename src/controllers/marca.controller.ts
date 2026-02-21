import { Request, Response } from "express";
import prisma from "../db/client";
import asyncHandler from "express-async-handler";

// GET
const getMarca = asyncHandler(async (req: Request, res: Response) => {
  const marcas = await prisma.marcas.findMany({
    select: { id_marca: true, nombre_marca: true },
  });
  if (marcas) {
    res.json(marcas);
  } else {
    res.status(404);
    throw new Error("Marca no encontrada");
  }
});
// POST
const createMarca = asyncHandler(async (req: Request, res: Response) => {
  const { nombre_marca } = req.body;
  const marca_exits = await prisma.marcas.findUnique({
    where: { nombre_marca },
  });
  if (marca_exits) {
    res.status(400);
    throw new Error("La marca ingresada ya existe.");
  }
  const marca = await prisma.marcas.create({ data: { nombre_marca } });
  if (marca) {
    res.status(201).json({ id: marca.id_marca, nombre: marca.nombre_marca });
  }
});

// PUT
const updateMarca = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre_marca_up } = req.body;

  const marca_finded = await prisma.marcas.findUnique({
    where: { id_marca: Number(id) },
  });
  if (!marca_finded) {
    res.status(404);
    throw new Error("Marca no encontrada");
  }
  const nombre_marca_update = await prisma.marcas.update({
    where: { id_marca: Number(id) },
    data: { nombre_marca: nombre_marca_up },
  });

  if (nombre_marca_update) {
    res.status(200).json({
      id: nombre_marca_update.id_marca,
      nombre: nombre_marca_update.nombre_marca,
    });
  } else {
    res.status(400);
    throw new Error("Error al actualizar la marca");
  }
});
// DELETE
const deleteMarca = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const marca_finded = await prisma.marcas.findUnique({
    where: { id_marca: Number(id) },
  });
  if (!marca_finded) {
    res.status(404);
    throw new Error("La marca ingresada no fue encontrada.");
  }
  await prisma.marcas.delete({ where: { id_marca: Number(id) } });
  res.status(200).json({ message: "Marca eliminada correctamente." });
});

export { getMarca, createMarca, updateMarca, deleteMarca };
