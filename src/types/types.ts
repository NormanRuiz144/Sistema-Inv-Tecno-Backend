// import { TipoIngreso } from "../generated/prisma/models/Entradas";

// Tipos
export interface IEntrada {
  id_entrada: number;
  id_usuario: number;
  tipo_ingreso: TipoIngreso;
  fecha_ingreso: Date;
  anulado: boolean;
}

export interface IingresoEntradas {
  tipoIngreso: any;
  detallesEntrada: [
    {
      id_producto: number;
      cantidad: number;
    },
  ];
}

enum TipoIngreso {
  "COMPRA",
  "DEVOLUCION",
  "OTRO",
}
