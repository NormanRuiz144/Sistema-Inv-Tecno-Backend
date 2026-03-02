import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import prisma from "../db/client";
import { ISalidas, ISalidas_Detalle, IrecibirSalidas } from "../types/types";
import { findProductById } from "../utils/metodos";

// GET
const getSalidas = asyncHandler(async (req: Request, res: Response) => {
  const salidas = await prisma.salidas.findMany();
  if (!salidas) {
    res.status(500);
    throw new Error("Error al intentar cargar las ventas.");
  }

  if (salidas.length == 0) {
    res.status(200).json({ message: "No hay ventas registradas." });
  } else {
    res.status(200).json(salidas);
  }
});

// GET BY ID WITH DETALLES
const getSalidasById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const salidaWithDetalles = await prisma.salidas.findFirst({
    where: { id_salida: Number(id) },
    include: { detallesSalidas: true },
  });

  if (!salidaWithDetalles) {
    res.status(404);
    throw new Error("Venta no encontrada.");
  } else {
    res.status(200).json(salidaWithDetalles);
  }
});

// POST
const createSalida = asyncHandler(async (req: Request, res: Response) => {
  let token = req.cookies.jwt;
  const { detallesSalida, cantidad_total, costo_total } =
    req.body as IrecibirSalidas;

  if (!detallesSalida) {
    res.status(400);
    throw new Error("No se recibieron detalles de la salida.");
  }

  if (token) {
    const decoded_token = jwt.verify(token, process.env.FIRMA as string) as {
      userId: number;
    };

    // Registar la salida
    const new_salida = await prisma.salidas.create({
      data: {
        id_usuario: decoded_token.userId,
        cantidad: cantidad_total,
        costo_total: costo_total,
        fecha_salida: new Date(Date.now()),
      },
    });
    // Ciclo
    for (const detalle of detallesSalida) {
      const productoBuscado = await prisma.productos.findUnique({
        where: { id_producto: detalle.id_producto },
      });
      if (!productoBuscado) {
        res.status(400).json({ message: "El producto no fue encontrado." });
        return;
      }
      const new_DetallesSalida = await prisma.detallesSalidas.create({
        data: {
          id_salida: new_salida.id_salida,
          id_producto: productoBuscado.id_producto,
          id_unidadMedida: productoBuscado.id_unidadMedida,
          cantidad: detalle.cantidad,
          precio_unitario: productoBuscado.precio,
          precio_total: detalle.cantidad * productoBuscado.precio,
        },
      });
      //   Actualizar stock
      await prisma.productos.update({
        where: { id_producto: Number(new_DetallesSalida.id_producto) },
        data: {
          // cantidad: detalle.cantidad + productoBuscado.cantidad,
          cantidad: { decrement: detalle.cantidad },
        },
      });
    }
    res.status(201).json({
      message: "Venta creada exitosamente.",
    });
  } else {
    res.status(401);
    throw new Error("Debe iniciar sesión para realizar esta acción.");
  }
});

// PUT
const updateSalida = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { detallesSalida } = req.body as IrecibirSalidas;
  let newCantidadTotal = 0;
  let newCostoTotal = 0;

  const salida_exist = await prisma.salidas.findFirst({
    where: { id_salida: Number(id) },
    // include: { detallesSalidas: true },
  });
  if (!salida_exist) {
    res.status(500);
    throw new Error("Error al intentar cargar las ventas.");
  }

  // Si otro ciclo para actualizar
  for (const detalle of detallesSalida) {
    const productoBuscado = await findProductById(res, detalle.id_producto);
    if (!productoBuscado) {
      res.status(400).json({ message: "El producto no fue encontrado." });
      return;
    }
    // Cantidades para actualizar el stock
    let cantidadActual = detalle.cantidad;
    newCantidadTotal += cantidadActual;
    newCostoTotal += cantidadActual * productoBuscado.precio;

    const cantidadAnterior = await prisma.detallesSalidas.findFirst({
      where: { id_salida: Number(id), id_producto: detalle.id_producto },
    });

    const detalleActualizado = await prisma.detallesSalidas.update({
      where: { id_detalleSalida: Number(cantidadAnterior?.id_detalleSalida) },
      data: {
        cantidad: cantidadActual,
        precio_unitario: productoBuscado?.precio,
        precio_total: cantidadActual * (productoBuscado?.precio || 0),
      },
    });
    if (detalleActualizado) {
      try {
        // Para que la cantidad no sea negativa
        if (cantidadActual > cantidadAnterior!.cantidad) {
          const diferencia = cantidadActual - cantidadAnterior!.cantidad;
          await prisma.productos.update({
            where: { id_producto: detalle.id_producto },
            data: {
              cantidad: { decrement: diferencia },
            },
          });
        } else if (cantidadActual < cantidadAnterior!.cantidad) {
          const diferencia = cantidadAnterior!.cantidad - cantidadActual;
          await prisma.productos.update({
            where: { id_producto: detalle.id_producto },
            data: {
              cantidad: { increment: diferencia },
            },
          });
        }
      } catch (error) {
        console.log("Error al actualizar el stock del producto:", error);
      }
    }
  }
  const salidaActualizada = await prisma.salidas.update({
    where: { id_salida: Number(id) },
    data: {
      cantidad: newCantidadTotal,
      costo_total: newCostoTotal,
    },
  });
  if (salidaActualizada) {
    res.status(200).json({
      message: "Salida actualizada exitosamente.",
      salida: salidaActualizada,
    });
  } else {
    res.status(404);
    throw new Error("Salida no encontrada.");
  }
});

// DELETE
const deleteSalida = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const salida_exits = await prisma.salidas.findFirst({
    where: { id_salida: Number(id) },
  });

  if (!salida_exits) {
    res.status(404);
    throw new Error("La venta indicada no fue encontrada.");
  }

  if (salida_exits.anulado) {
    res.status(400);
    throw new Error("La venta ya se encuentra anulada.");
  }
  const detallesSalida = await prisma.detallesSalidas.findMany({
    where: { id_salida: Number(id) },
  });

  // Restaurar el stock
  for (const detalle of detallesSalida) {
    await prisma.productos.update({
      where: { id_producto: Number(detalle.id_producto) },
      data: {
        cantidad: { increment: detalle.cantidad },
      },
    });
  }
  // Terminar de anular
  await prisma.salidas.update({
    where: { id_salida: Number(id) },
    data: { anulado: true },
  });
  res.status(200).json({ message: "Venta cancelada correctamente." });
});

export { getSalidas, getSalidasById, createSalida, updateSalida, deleteSalida };
