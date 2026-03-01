import prisma from "../db/client";
import { Response } from "express";

const findProductById = async (res: Response, id: number) => {
  const productoBuscado = await prisma.productos.findUnique({
    where: { id_producto: id },
  });
  if (!productoBuscado) {
    res.status(400).json({ message: "El producto no fue encontrado." });
    return;
  }
  return productoBuscado;
};

export { findProductById };
