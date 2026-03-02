// Tipos
export interface IUsuario {
  id_usuario: number;
  alias: string;
  nombre: string;
  clave: string;
}

export interface IrecibirUsuario {
  nombre_usuario: string;
  alias_usuario: string;
  contrasena_usuario: string;
}

export interface IEntrada {
  id_entrada: number;
  id_usuario: number;
  tipo_ingreso: TipoIngreso;
  fecha_ingreso: Date;
  anulado: boolean;
}

export interface IrecibirEntradas {
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

export interface ISalidas {
  id_salida: number;
  id_usuario: number;
  fecha_salida: Date;
  cantidad: number;
  costo_total: number;
  anulado: boolean;
}
export interface ISalidas_Detalle {
  id_detalleSalida: number;
  id_salida: number;
  id_producto: number;
  id_unidadMedida: number;
  cantidad: number;
  precio_unitario: number;
  precio_total: number;
}

export interface IrecibirSalidas {
  // Ambos se calcularan en el front
  cantidad_total: number;
  costo_total: number;
  detallesSalida: [
    {
      id_producto: number;
      cantidad: number;
    },
  ];
}
