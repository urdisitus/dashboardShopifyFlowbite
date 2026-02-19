import { State } from "src/app/services/generic/StateEnum";
import { IIdNameEntity } from "../IIdNameEntity";

export class IdNameEntity<TKey> implements IIdNameEntity<TKey>{
    id: TKey;
    name: string;
    state: State;    

    constructor(){
        this.state = State.Enabled;
    }
}