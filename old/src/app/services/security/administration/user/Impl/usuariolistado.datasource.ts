import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { UsuarioListado } from "src/app/models/security/administration/user/UsuarioListado";
import { BehaviorSubject, Observable } from "rxjs";
import { ServiceUser } from "./user.service";
import { ResultPage } from "src/app/models/generic/Impl/ResultPage";
import { Injectable } from "@angular/core";

@Injectable()
export class UsuarioListadoDataSource implements DataSource<UsuarioListado> {
    private usuarioListadoSubject = new BehaviorSubject<UsuarioListado[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    public resultPage : ResultPage<UsuarioListado> = {};    

    constructor(
        private _serviceUser: ServiceUser) {
    }

    loadUsuarioListado(
        filter: string,
        pageIndex: number,
        pageSize: number) {
        this.loadingSubject.next(true);
        this._serviceUser.filter({
            pageIndex: pageIndex,
            pageSize: pageSize,
            param: filter
        }).then((result: ResultPage<UsuarioListado>) => {
            this.resultPage = result;            
            this.usuarioListadoSubject.next(result.elements);            
            this.loadingSubject.next(false);  
        }).catch(()=>{
            this.loadingSubject.next(false);  
        });
    }

    connect(collectionViewer: CollectionViewer): Observable<UsuarioListado[]> {        
        return this.usuarioListadoSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.usuarioListadoSubject.complete();
        this.loadingSubject.complete();
    }
}