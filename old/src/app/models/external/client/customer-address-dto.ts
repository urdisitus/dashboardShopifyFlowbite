import { LatLngDto } from "./LatLngDto";

export interface CustomerAddressDto {
    id?: number;
    customer_id?: number;
    first_name?: string;
    last_name?: string;
    address1?: string;
    address2?: string;
    phone?: string;
    city?: string;
    province?: string;
    country?: string;
    default?: boolean;
    latLng?: LatLngDto;
}