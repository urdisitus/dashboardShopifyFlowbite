export interface IEventcodesStatusCountDto {
  keyTypeEventCode?: string;
  descripcion?: string;
  keyEventStatus?: string;
  tipoInfoId?: string;
  count?: number;
}

export interface IEventTypeCountDto {
  type: string;
  error: number;
  pending: number;
  success: number;
}
