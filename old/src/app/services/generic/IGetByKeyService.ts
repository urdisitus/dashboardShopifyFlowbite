export interface IGetByKeyService<Tkey, TEntity> {
    getByKey(id: Tkey) : Promise<TEntity>;    
}