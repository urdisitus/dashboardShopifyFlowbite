import { CustomerAddressDto } from "./customer-address-dto";

export interface CustomerDto {
    id?: number;
    email?: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    created_at?: string;
    updated_at?: string;
    orders_count?: number;
    state?: string;
    total_spent?: string;
    verified_email?: boolean;
    tags?: string;
    addresses?: CustomerAddressDto[];
}