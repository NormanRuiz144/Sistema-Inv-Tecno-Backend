import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import prisma from "../db/client";
import { IingresoEntradas, IEntrada } from "../types/types";

// GET
const getEntradas_Detalles = asyncHandler(
  async (req: Request, res: Response) => {
    const entradas = await prisma.entradas.findMany();
    if (!entradas) {
      res.status(404);
      throw new Error("Error al intentar cargar las entradas.");
    } else {
      res.status(200).json(entradas);
    }
  }
);

// GET BY ID WITH DETALLES
const getEntradasById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const entradaWithDetalles = await prisma.entradas.findFirst({
    where: { id_entrada: Number(id) },
    include: { detallesEntradas: true },
  });

  if (!entradaWithDetalles) {
    res.status(404);
    throw new Error("Entrada no encontrada.");
  } else {
    res.status(200).json(entradaWithDetalles);
  }
});

// POST
const createEntrada = asyncHandler(async (req: Request, res: Response) => {
  let token = req.cookies.jwt;
  const { detallesEntrada, tipoIngreso } = req.body as IingresoEntradas;

  //   Decodificar el token
  if (token) {
    const decoded_token = jwt.verify(token, process.env.FIRMA as string) as {
      userId: number;
    };

    const new_entrada = await prisma.entradas.create({
      data: {
        tipo_ingreso: tipoIngreso, // hay un detalle con los tipos xd
        id_usuario: decoded_token.userId,
        fecha_ingreso: new Date(Date.now()),
      },
    });

    // Ciclo para los productos
    for (const detalle of detallesEntrada) {
      const productoBuscado = await prisma.productos.findUnique({
        where: { id_producto: detalle.id_producto },
      });
      if (!productoBuscado) {
        res.status(400).json({ message: "El producto no fue encontrado." });
        return;
      }
      const new_DetallesEntrada = await prisma.detallesEntradas.create({
        data: {
          id_entrada: new_entrada.id_entrada,
          id_producto: productoBuscado.id_producto,
          id_unidadMedida: productoBuscado.id_unidadMedida,
          cantidad: detalle.cantidad,
          precio_unitario: productoBuscado.precio,
          precio_total: detalle.cantidad * productoBuscado.precio,
        },
      });
      //   Actualizar stock
      await prisma.productos.update({
        where: { id_producto: Number(new_DetallesEntrada.id_producto) },
        data: {
          // cantidad: detalle.cantidad + productoBuscado.cantidad,
          cantidad: { increment: detalle.cantidad },
        },
      });
    }

    res.status(201).json({
      message: "Entrada creada exitosamente.",
    });
  } else {
    res.status(401);
    throw new Error("Debe iniciar sesión para realizar esta acción.");
  }
});
// PUT
const updateEntrada = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { tipoIngreso } = req.body as IingresoEntradas;
  const entradaActualizada = await prisma.entradas.update({
    where: { id_entrada: Number(id) },
    data: {
      tipo_ingreso: tipoIngreso,
    },
  });
  if (entradaActualizada) {
    res.status(200).json({
      message: "Entrada actualizada exitosamente.",
      entrada: entradaActualizada,
    });
  } else {
    res.status(404);
    throw new Error("Entrada no encontrada.");
  }
});

// DELETE
const deleteEntrada = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const entrada_exits = await prisma.entradas.findFirst({
    where: { id_entrada: Number(id) },
  });

  if (!entrada_exits) {
    res.status(404);
    throw new Error("El ingreso indicado no fue encontrado.");
  }

  if (entrada_exits.anulado) {
    res.status(400);
    throw new Error("El ingreso ya se encuentra anulado.");
  }
  const productos = await prisma.detallesEntradas.findMany({
    where: { id_entrada: Number(id) },
  });

  // Restaurar el stock
  for (const detalles of productos) {
    await prisma.productos.update({
      where: { id_producto: Number(detalles.id_producto) },
      data: {
        cantidad: { decrement: detalles.cantidad },
      },
    });
  }
  // Terminar de anular
  await prisma.entradas.update({
    where: { id_entrada: Number(id) },
    data: { anulado: true },
  });
  res.status(200).json({ message: "Entrada eliminada correctamente." });
});

export {
  getEntradas_Detalles,
  getEntradasById,
  createEntrada,
  updateEntrada,
  deleteEntrada,
};
