import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import prisma from "../db/client";

// GET
const getUnidadM = asyncHandler(async (req: Request, res: Response) => {
  const unidadM = await prisma.unidadMedida.findMany();
  if (unidadM) {
    res.status(200).json(unidadM);
  } else {
    res.status(404);
    throw new Error("Error al cargar las unidades de medida.");
  }
});
// POST
const createUnidadM = asyncHandler(async (req: Request, res: Response) => {
  const { nombre_UM, simbolo_UM } = req.body;

  const UM_exists = await prisma.unidadMedida.findFirst({
    where: {
      nombre_unidad: nombre_UM,
    },
  });

  if (UM_exists) {
    res.status(400);
    throw new Error("La unidad de medida ya existe.");
  }

  const nuevaUnidadM = await prisma.unidadMedida.create({
    data: {
      nombre_unidad: nombre_UM,
      abreviatura: simbolo_UM,
    },
  });
  res.status(201).json(nuevaUnidadM);
});
// PUT
const updateUnidadM = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre_UM, simbolo_UM } = req.body;

  const UM_exists = await prisma.unidadMedida.findFirst({
    where: {
      id_unidadMedida: Number(id),
    },
  });
  if (!UM_exists) {
    res.status(404);
    throw new Error("La unidad de medida no existe.");
  }

  const UM_updated = await prisma.unidadMedida.update({
    where: {
      id_unidadMedida: Number(id),
    },
    data: {
      nombre_unidad: nombre_UM,
      abreviatura: simbolo_UM,
    },
  });
  if (UM_updated) {
    res.status(200).json(UM_updated);
  } else {
    res.status(404);
    throw new Error("Error al actualizar la unidad de medida.");
  }
});

//  DELETE
const deleteUnidadM = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const UM_exists = await prisma.unidadMedida.findFirst({
    where: { id_unidadMedida: Number(id) },
  });

  if (!UM_exists) {
    res.status(404);
    throw new Error("La unidad de medida no fue encontrada.");
  }

  await prisma.unidadMedida.delete({ where: { id_unidadMedida: Number(id) } });
  res
    .status(200)
    .json({ message: "Unidad de medida eliminada correctamente." });
});

export { getUnidadM, createUnidadM, updateUnidadM, deleteUnidadM };
