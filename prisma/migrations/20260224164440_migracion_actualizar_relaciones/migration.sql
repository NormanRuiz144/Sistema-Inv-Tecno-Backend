-- AddForeignKey
ALTER TABLE "DetallesEntradas" ADD CONSTRAINT "DetallesEntradas_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "Productos"("id_producto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetallesEntradas" ADD CONSTRAINT "DetallesEntradas_id_unidadMedida_fkey" FOREIGN KEY ("id_unidadMedida") REFERENCES "UnidadMedida"("id_unidadMedida") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetallesSalidas" ADD CONSTRAINT "DetallesSalidas_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "Productos"("id_producto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetallesSalidas" ADD CONSTRAINT "DetallesSalidas_id_unidadMedida_fkey" FOREIGN KEY ("id_unidadMedida") REFERENCES "UnidadMedida"("id_unidadMedida") ON DELETE RESTRICT ON UPDATE CASCADE;
