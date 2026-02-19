export interface IRemoteStringDto {
  application?: string;
  namespace?: string;
  key?: string;
  locale?: string;
  value?: string;
  createDate?: Date;
  editDate?: Date;
  createUser?: string;
  editUser?: string;
  hasChange?: boolean;
}

export interface IRemoteStringParam {
  application?: string;
  namespace?: string;
  criteria?: string;
  key?: string;
  locale?: string;
}
