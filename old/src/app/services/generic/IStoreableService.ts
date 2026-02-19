export interface IStoreService<T>{
    store(param: T):Promise<T>;
}