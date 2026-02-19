export interface ISearchableService<TEntity> {
    search(param: any) : Promise<TEntity[]>;    
}