import { IListableService } from "./IListableService";
import { ISearchableService } from "./ISearchableService";
import { IDeleteableService } from "./IDeleteableService";
import { IDisableService } from "./IDisableService";
import { IEnableService } from "./IEnableService";
import { IGetByKeyService } from "./IGetByKeyService";
import { IStoreService } from "./IStoreableService";

export interface ICrudService<TKey, TEntity> extends 
    IListableService<TEntity>,
    ISearchableService<TEntity>,
    IDeleteableService<TKey, TEntity>,
    IDisableService<TKey, TEntity>,
    IEnableService<TKey, TEntity>, 
    IGetByKeyService<TKey, TEntity>, 
    IStoreService<TEntity>{
        
}