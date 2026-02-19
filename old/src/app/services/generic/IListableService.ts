export interface IListableService<T> {
    listAll() : Promise<T[]>;    
}