import { State } from "src/app/services/generic/StateEnum";

export interface IIdDescriptionEntity<TKey>{
    id: TKey;
    descripcion: string;
    estado: State;    
}