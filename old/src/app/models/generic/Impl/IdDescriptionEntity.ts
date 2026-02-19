import { State } from "src/app/services/generic/StateEnum";
import { IIdDescriptionEntity } from "../IIdDescriptionEntity";

export class IdDescriptionEntity<TKey> implements IIdDescriptionEntity<TKey>{
    id: TKey;
    descripcion: string;
    estado: State;    

    constructor(){
        this.estado = State.Enabled;
    }
}