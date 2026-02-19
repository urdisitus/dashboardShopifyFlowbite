import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, Observable } from "rxjs";
import { ResultPage } from "src/app/models/generic/Impl/ResultPage";
import { Injectable } from "@angular/core";
import { TurnoDto } from "src/app/models/external/arqueo/ArqueoRecuperarResult";
import { ServiceTurno } from "./turno.service";
import { GetTurnosParam } from "src/app/models/external/arqueo/GetTurnosParam";


@Injectable()
export class TurnoDataSource implements DataSource<TurnoDto> {
    private subject = new BehaviorSubject<TurnoDto[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    public resultPage: ResultPage<TurnoDto> = {};

    constructor(
        private service: ServiceTurno) {
    }

    search(param: GetTurnosParam) {
        this.loadingSubject.next(true);
        this.service.get(param).then((result: ResultPage<TurnoDto>) => {
            result.elements.forEach(element => {
                element.fecha = new Date(element.fecha.toString());
            });
            this.resultPage = result;
            this.subject.next(result.elements);
            this.loadingSubject.next(false);
        }).catch(() => {
            this.loadingSubject.next(false);
        });
    }

    connect(collectionViewer: CollectionViewer): Observable<TurnoDto[]> {
        return this.subject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.subject.complete();
        this.loadingSubject.complete();
    }
}