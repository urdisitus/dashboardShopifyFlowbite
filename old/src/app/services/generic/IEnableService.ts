export interface IEnableService<TKey,TEntity>{
    enable(id: TKey):Promise<TEntity>;
}