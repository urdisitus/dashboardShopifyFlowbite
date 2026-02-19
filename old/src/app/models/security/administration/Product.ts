import { Image } from "../../Image";

export class Product {
    id?: string;
    nombre?: string;
    descripcion?: string;
    precio?: number;
    precioStandard? : number;
    imagenes?: Image[];
}