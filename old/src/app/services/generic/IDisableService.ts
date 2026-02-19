export interface IDisableService<TKey,TEntity>{
    disable(id: TKey):Promise<TEntity>;
}