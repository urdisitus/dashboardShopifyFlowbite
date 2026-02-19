import { ICrudService } from '../ICrudService';

export abstract class CrudService<TKey, TEntity> implements ICrudService<TKey, TEntity> {

    constructor() {
    }

    abstract listAll(): Promise<TEntity[]>;
    abstract search(param: any): Promise<TEntity[]>;
    abstract delete(id: TKey): Promise<TEntity>;
    abstract disable(id: TKey): Promise<TEntity>;
    abstract enable(id: TKey): Promise<TEntity>;
    abstract getByKey(id: TKey): Promise<TEntity>;
    abstract store(param: TEntity): Promise<TEntity>;
}
