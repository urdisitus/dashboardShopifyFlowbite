export interface IDeleteableService<TKey, TEntity>{
    delete(id: TKey):Promise<TEntity>;
}