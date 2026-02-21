-- CreateEnum
CREATE TYPE "TipoIngreso" AS ENUM ('COMPRA', 'DEVOLUCION', 'OTRO');

-- CreateTable
CREATE TABLE "Marcas" (
    "id_marca" SERIAL NOT NULL,
    "nombre_marca" TEXT NOT NULL,

    CONSTRAINT "Marcas_pkey" PRIMARY KEY ("id_marca")
);

-- CreateTable
CREATE TABLE "UnidadMedida" (
    "id_unidadMedida" SERIAL NOT NULL,
    "nombre_unidad" TEXT NOT NULL,
    "abreviatura" TEXT NOT NULL,

    CONSTRAINT "UnidadMedida_pkey" PRIMARY KEY ("id_unidadMedida")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id_usuario" SERIAL NOT NULL,
    "alias" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "clave" TEXT NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "Productos" (
    "id_producto" SERIAL NOT NULL,
    "id_marca" INTEGER NOT NULL,
    "id_unidadMedida" INTEGER NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "modelo" TEXT,
    "capacidad" TEXT,
    "eficiencia" TEXT,
    "voltaje" TEXT,
    "precio" DOUBLE PRECISION NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "cantidad_minima" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Productos_pkey" PRIMARY KEY ("id_producto")
);

-- CreateTable
CREATE TABLE "Entradas" (
    "id_entrada" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "tipo_ingreso" "TipoIngreso" NOT NULL DEFAULT 'COMPRA',
    "fecha_ingreso" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Entradas_pkey" PRIMARY KEY ("id_entrada")
);

-- CreateTable
CREATE TABLE "DetallesEntradas" (
    "id_detalleEntrada" SERIAL NOT NULL,
    "id_entrada" INTEGER NOT NULL,
    "id_producto" INTEGER NOT NULL,
    "id_unidadMedida" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" DOUBLE PRECISION NOT NULL,
    "precio_total" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "DetallesEntradas_pkey" PRIMARY KEY ("id_detalleEntrada")
);

-- CreateTable
CREATE TABLE "Salidas" (
    "id_salida" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "fecha_salida" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cantidad" INTEGER NOT NULL,
    "costo_total" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Salidas_pkey" PRIMARY KEY ("id_salida")
);

-- CreateTable
CREATE TABLE "DetallesSalidas" (
    "id_detalleSalida" SERIAL NOT NULL,
    "id_salida" INTEGER NOT NULL,
    "id_producto" INTEGER NOT NULL,
    "id_unidadMedida" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" DOUBLE PRECISION NOT NULL,
    "precio_total" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "DetallesSalidas_pkey" PRIMARY KEY ("id_detalleSalida")
);

-- CreateIndex
CREATE UNIQUE INDEX "Marcas_nombre_marca_key" ON "Marcas"("nombre_marca");

-- CreateIndex
CREATE UNIQUE INDEX "UnidadMedida_nombre_unidad_key" ON "UnidadMedida"("nombre_unidad");

-- CreateIndex
CREATE UNIQUE INDEX "UnidadMedida_abreviatura_key" ON "UnidadMedida"("abreviatura");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_alias_key" ON "Usuario"("alias");

-- CreateIndex
CREATE UNIQUE INDEX "Productos_codigo_key" ON "Productos"("codigo");

-- AddForeignKey
ALTER TABLE "Productos" ADD CONSTRAINT "Productos_id_marca_fkey" FOREIGN KEY ("id_marca") REFERENCES "Marcas"("id_marca") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Productos" ADD CONSTRAINT "Productos_id_unidadMedida_fkey" FOREIGN KEY ("id_unidadMedida") REFERENCES "UnidadMedida"("id_unidadMedida") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entradas" ADD CONSTRAINT "Entradas_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetallesEntradas" ADD CONSTRAINT "DetallesEntradas_id_entrada_fkey" FOREIGN KEY ("id_entrada") REFERENCES "Entradas"("id_entrada") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Salidas" ADD CONSTRAINT "Salidas_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetallesSalidas" ADD CONSTRAINT "DetallesSalidas_id_salida_fkey" FOREIGN KEY ("id_salida") REFERENCES "Salidas"("id_salida") ON DELETE RESTRICT ON UPDATE CASCADE;
