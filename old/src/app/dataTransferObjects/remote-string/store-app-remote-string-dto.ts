export interface IStoreAppRemoteStringDto {
  application?: string;
  detail?: IStoreAppRemoteStringDetailDto[];
  user?: string;
}

export interface IStoreAppRemoteStringDetailDto {
  namespace?: string;
  key?: string;
  locale?: string;
  value?: string;
}
