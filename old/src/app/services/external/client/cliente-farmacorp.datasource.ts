import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { UsuarioListado } from "src/app/models/security/administration/user/UsuarioListado";
import { BehaviorSubject, Observable } from "rxjs";
import { ResultPage } from "src/app/models/generic/Impl/ResultPage";
import { Injectable } from "@angular/core";
import { ClienteFarmacorpDto } from "src/app/models/external/client/cliente-farmacorp-dto";
import { ServiceClienteFarmacorp } from "./cliente-farmacorp.service";
import { environment } from 'src/environments/environment';

export interface SearchClienteFarmacorpParam {
    cedula?: string;
    email?: string;
    nombres?: string;
}

@Injectable()
export class ClienteFarmacorpDataSource implements DataSource<ClienteFarmacorpDto> {
    private subject = new BehaviorSubject<ClienteFarmacorpDto[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    public resultPage: ResultPage<ClienteFarmacorpDto> = {};

    constructor(
        private _serviceUser: ServiceClienteFarmacorp) {
    }

    search(param: SearchClienteFarmacorpParam,
        pageIndex: number,
        pageSize: number) {
        this.loadingSubject.next(true);
        this._serviceUser.search({
            noCia: environment.configuration.noCia,
            pageNumber: pageIndex,
            pageSize: pageSize,
            cedula: param.cedula,
            email: param.email,
            nombres: param.nombres
        }).then((result: ResultPage<ClienteFarmacorpDto>) => {
            this.resultPage = result;
            this.subject.next(result.elements);
            this.loadingSubject.next(false);
        }).catch(() => {
            this.loadingSubject.next(false);
        });
    }

    connect(collectionViewer: CollectionViewer): Observable<ClienteFarmacorpDto[]> {
        return this.subject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.subject.complete();
        this.loadingSubject.complete();
    }
}
