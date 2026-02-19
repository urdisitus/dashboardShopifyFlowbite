import { State } from "src/app/services/generic/StateEnum";

export interface IIdNameEntity<TKey>{
    id: TKey;
    name: string;
    state: State;    
}