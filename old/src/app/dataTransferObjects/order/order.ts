export interface ListOrderParam {
  criteria: string
  extCode: string[]
  extCodeInvoice: string[]
  invoiceProvider: string[]
  keyBodega: string[]
  status: number[]
  minTotalAmount: number
  maxTotalAmount: number
  initDate: string
  endDate: string
}

export interface ResponseFilterRoot {
  data: OrderDto[]
  start: number
  length: number
  filtered: number
  total: number
}
export class OrderDto {
  id?: number
  extCode?: string
  extName?: string
  extCodeInvoice?: string
  invoiceProvider?: string
  noCia?: string
  keyBodega?: string
  pointOfSaleId?: number
  freeZone?: boolean
  flowType?: string
  hash?: string
  distributionCenter?: string
  branchOfficeId?: number
  branchOfficeNro?: number
  preparationDate?: Date
  preparationUserId?: string
  preparationUserName?: string
  subtotalAmount?: number
  discountPercent?: number
  discountAmount?: number
  totalAmount?: number
  cashierUserId?: string
  cashierUserName?: string
  keyOrigin?: string
  keyAppOrigin?: string
  appOriginVersion?: string
  infoExtra?: string
  erpFarmacorpId?: string
  erpClientId?: string
  erpGroupId?: string
  brandId?: string
  saleUserId?: string
  saleUserName?: string
  customerId?: string
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  observation?: string
  postVoidOtherMotive?: string
  postVoidMotiveId?: number
  postVoidDate?: Date
  postVoidUserId?: string
  postVoidUserName?: string
  postVoidAuthUserId?: string
  postVoidAuthUserName?: string
  invoiceIdentityDocumentName?: string
  invoiceIdentityDocumentNumber?: string
  invoiceIdentityDocumentTypeId?: number
  invoiceIdentityDocumentComplement?: string
  invoiceCuf?: string
  invoiceQrBuffer?: string
  invoiceEmissionDate?: Date
  invoiceNumber?: number
  status?: number
  stateName?: string
  createUtcDate?: Date
  createUserId?: number
  editUserId?: number
  editUtcDate?: Date
  saleOrderDelivery?: SaleOrderDelivery
  saleOrderDetail?: SaleOrderDetail[]
  saleOrderPayment?: SaleOrderPayment[]
  saleOrderDiscount?: SaleOrderDiscount[]
  saleOrderDetailDiscount?: SaleOrderDetailDiscount[]
}

export class SaleOrderDelivery {
  id: number
  saleOrderId: number
  originLatitude: number
  originLongitude: number
  originAddress?: string
  destinationLatitude: number
  destinationLongitude: number
  destinationAddress: string
  destinationAddressType: string
  provider?: string
  providerStatus: string
  stateName?: string
  acceptedByDriver: string
  driverId: string
  driverUserName?: string
  arriveToOrigin: string
  arriveToDestination: string
  success?: string
  trackingLink?: string
  successDestinationLatitude: number
  successDestinationLongitude: number
  successDestinationAddress: string
  infoExtra: string
  status: number
  createUtcDate: string
  createUserId: number
  editUserId: number
  editUtcDate: string
}

export interface SaleOrderDetail {
  id: number
  saleOrderId: number
  lineIndex: number
  keyOrigin: string
  appOriginProductCode: string
  erpProductCode: string
  productName: string
  productImageUrl: string
  productMeasureUnit: string
  productUnitPrice: number
  quantity: number
  subtotalAmount: number
  discountPercent: number
  discountAmount: number
  totalAmount: number
  infoExtra: string
  status: number
  createUtcDate: string
  createUserId: number
  editUserId: number
  editUtcDate: string
}

export interface SaleOrderPayment {
  id: number
  saleOrderId: number
  appOriginPaymentTypeCode: string
  appOriginPaymentTypeName: string
  erpPaymentTypeCode: string
  paymentTypeName: string
  bankCode: string
  bankName: string
  cardNumber: string
  customerCode: string
  confirmationCode: string
  amount: number
  infoExtra: string
  status: number
  createUtcDate: string
  createUserId: number
  editUserId: number
  editUtcDate: string
}

export interface SaleOrderDiscount {
  id: number
  saleOrderId: number
  discountId: string
  discountTypeId: string
  description: string
  percent: number
  amount: number
  userId: string
  userName: string
  infoExtra: string
  status: number
  createUtcDate: string
  createUserId: number
  editUserId: number
  editUtcDate: string
}

export interface SaleOrderDetailDiscount {
  id: number
  saleOrderDetailId: number
  saleOrderId: number
  discountId: string
  discountTypeId: string
  description: string
  percent: number
  amount: number
  userId: string
  userName: string
  infoExtra: string
  status: number
  createUtcDate: string
  createUserId: number
  editUserId: number
  editUtcDate: string
}

export interface IShopifyShopDtp {
  shopKey?: string;
  name?: string;
  adminUrl?: string;
}

export interface IShopifyOrderSimpleDto {
  id: number;
  adminUrl?: string;
  createdAt?: string;
  number?: number;
  note?: string;
  totalPrice: number;
  orderNumber: number;
  customerName?: string;
  saleOrderId?: number;
  bSelected?: boolean;
}

export interface IShopifyCollectionPageDto<TData> {
  data?: TData[];
  nextPageInfo?: string;
  prevPageInfo?: string;
}
