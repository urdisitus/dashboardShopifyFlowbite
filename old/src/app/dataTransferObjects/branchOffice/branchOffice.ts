export interface SucursalDto {
  noCia: string
  keyBodega: string
  name: string
  city: string
  descript: string
  address: string
  phone: string
  cellphone: string
  freeZone: boolean
  branchOfficeId: number
  branchOfficeNro: number
  latitud: number
  longitud: number
  imageUrl: string
  schedule: string
  services: string
  brandId: string
  brandName: string
  zoneId: string
  zoneName: string
  departmentId: string
  departmentName: string
  regionId: string
  regionName: string
  status: number
  createUtcDate: string
  createUserId: string
  editUserId: string
  editUtcDate: string

}
export interface SucursalPolygonDto extends SucursalDto {
  poligon: CoordenadasDto[]
}

export interface CoordenadasDto {
  lat: number
  lng: number
}

export interface GetSucursalParam {
  criteria: string
  freeZone: boolean[]
  status: number[]
}
