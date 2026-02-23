import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import prisma from "../db/client";

// GET
const getProductos = asyncHandler(async (req: Request, res: Response) => {
  const productos = await prisma.productos.findMany();
  if (!productos) {
    res.status(404);
    throw new Error("Error al intentar cargar los productos.");
  } else if (productos.length == 0) {
    res.status(400).json({
      message: "No hay productos ingresados, Por favor ingrese productos.",
    });
  } else {
    res.status(200).json(productos);
  }
});
// GET BY ID
const getProductoById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const producto = await prisma.productos.findFirst({
    where: { id_producto: Number(id) },
  });
  if (!producto) {
    res.status(404);
    throw new Error("Producto no encontrado.");
  } else {
    res.status(200).json(producto);
  }
});
// GET BY CODIGO
const getProductoByCodigo = asyncHandler(
  async (req: Request, res: Response) => {
    const { codigo_prod } = req.body;
    const producto = await prisma.productos.findFirst({
      where: { codigo: codigo_prod },
    });
    if (!producto) {
      res.status(404).json({ message: "Producto no encontrado." });
    } else {
      res.status(200).json(producto);
    }
  }
);

// POST

const createProducto = asyncHandler(async (req: Request, res: Response) => {
  const {
    codigo_prod,
    nombre_prod,
    modelo_prod,
    capacidad_prod,
    eficiencia_prod,
    voltaje_prod,
    precio_prod,
    cantidad_prod,
    cantidad_min_prod,
    id_marca_prod,
    id_unidadMedida_prod,
  } = req.body;

  //   Verificar
  if (!codigo_prod) {
    res.status(400).json({ message: "El código del producto es requerido." });
    return;
  } else if (!nombre_prod) {
    res.status(400).json({ message: "El nombre del producto es requerido." });
    return;
  } else if (cantidad_prod && cantidad_prod < 0) {
    res.status(400).json({
      message: "La cantidad del producto debe ser mayor o igual a cero.",
    });
    return;
  } else if (cantidad_min_prod && cantidad_min_prod < 0) {
    res.status(400).json({
      message: "La cantidad mínima del producto debe ser mayor o igual a cero.",
    });
    return;
  } else if (!id_marca_prod || !id_unidadMedida_prod) {
    res.status(400).json({
      message:
        "Debe indicar la marca y la unidad de medida del producto son requeridas.",
    });
    return;
  }

  const productoExistente = await prisma.productos.findUnique({
    where: { codigo: codigo_prod },
  });
  if (productoExistente) {
    res.status(400).json({ message: "El código del producto ya existe." });
    return;
  }
  const nuevoProducto = await prisma.productos.create({
    data: {
      codigo: codigo_prod,
      nombre: nombre_prod,
      modelo: modelo_prod,
      capacidad: capacidad_prod,
      eficiencia: eficiencia_prod,
      voltaje: voltaje_prod,
      precio: precio_prod,
      cantidad: cantidad_prod,
      cantidad_minima: cantidad_min_prod,
      id_marca: id_marca_prod,
      id_unidadMedida: id_unidadMedida_prod,
    },
  });
  res.status(201).json(nuevoProducto);
});

// PUT
const updateProducto = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    codigo_prod,
    nombre_prod,
    modelo_prod,
    capacidad_prod,
    eficiencia_prod,
    voltaje_prod,
    precio_prod,
    cantidad_prod,
    cantidad_min_prod,
    id_marca_prod,
    id_unidadMedida_prod,
  } = req.body;

  if (!codigo_prod) {
    res.status(400).json({ message: "El código del producto es requerido." });
    return;
  } else if (!nombre_prod) {
    res.status(400).json({ message: "El nombre del producto es requerido." });
    return;
  } else if (cantidad_prod && cantidad_prod < 0) {
    res.status(400).json({
      message: "La cantidad del producto debe ser mayor o igual a cero.",
    });
    return;
  } else if (cantidad_min_prod && cantidad_min_prod < 0) {
    res.status(400).json({
      message: "La cantidad mínima del producto debe ser mayor o igual a cero.",
    });
    return;
  } else if (!id_marca_prod && !id_unidadMedida_prod) {
    res.status(400).json({
      message:
        "Debe indicar la marca y la unidad de medida del producto son requeridas.",
    });
    return;
  }

  const productoExistente = await prisma.productos.findUnique({
    where: { codigo: codigo_prod },
  });
  if (!productoExistente) {
    res.status(400).json({ message: "El código del producto no existe." });
    return;
  }
  const productoActualizado = await prisma.productos.update({
    where: { id_producto: Number(id) },
    data: {
      codigo: codigo_prod || productoExistente.codigo,
      nombre: nombre_prod || productoExistente.nombre,
      modelo: modelo_prod || productoExistente.modelo,
      capacidad: capacidad_prod || productoExistente.capacidad,
      eficiencia: eficiencia_prod || productoExistente.eficiencia,
      voltaje: voltaje_prod || productoExistente.voltaje,
      precio: precio_prod || productoExistente.precio,
      cantidad: cantidad_prod || productoExistente.cantidad,
      cantidad_minima: cantidad_min_prod || productoExistente.cantidad_minima,
      id_marca: id_marca_prod || productoExistente.id_marca,
      id_unidadMedida:
        id_unidadMedida_prod || productoExistente.id_unidadMedida,
    },
  });
  if (productoExistente !== productoActualizado) {
    res.status(200).json(productoActualizado);
  } else {
    res.status(400);
    throw new Error("Error al actualizar el producto.");
  }
});
// DELETE
const deleteProducto = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const produc_exists = await prisma.productos.findFirst({
    where: { id_producto: Number(id) },
  });

  if (!produc_exists) {
    res.status(404);
    throw new Error("El producto no fue encontrado.");
  } else if (produc_exists.activo === false) {
    res.status(400).json({ message: "El producto ya se encuentra eliminado." });
    return;
  }

  await prisma.productos.update({
    where: { id_producto: Number(id) },
    data: { activo: false },
  });
  res.status(200).json({ message: "Producto eliminado correctamente." });
});

export {
  getProductos,
  getProductoById,
  getProductoByCodigo,
  createProducto,
  updateProducto,
  deleteProducto,
};
