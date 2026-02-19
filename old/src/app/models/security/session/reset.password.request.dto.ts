export interface IResetPasswordRequestDto {
    userId?: number,
    token?: string,
    estado?: number,
    fechaVigencia?: string,
    fechaCreacion?: string,
    fechaModificacion?: string,
    id?: number
}