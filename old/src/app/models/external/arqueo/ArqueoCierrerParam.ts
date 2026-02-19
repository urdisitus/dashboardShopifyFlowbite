  export interface ArqueoDetalle {
      tipoPagoId: number;
      monto: number;
  }

  export interface ArqueoCierreParam {
      turnoId: number;
      observacionCierre: string;
      arqueoDetalle: ArqueoDetalle[];
  }
