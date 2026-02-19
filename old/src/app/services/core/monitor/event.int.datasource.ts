import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, Observable } from "rxjs";
import { ResultPage } from "src/app/models/generic/Impl/ResultPage";
import { Injectable } from "@angular/core";
import { ISimpleEventIntDto } from "src/app/dataTransferObjects/monitor/eventint/simple.event.int.dto";
import { EventIntegrationService } from "./event.int.service";
import { IFilterEventIntParam, IPaginationParam } from "src/app/dataTransferObjects/monitor/eventint/filter.event.int.param";
import { List } from "linqts";

@Injectable()
export class EventIntDataSource implements DataSource<ISimpleEventIntDto> {
    private dataResultSubject = new BehaviorSubject<ISimpleEventIntDto[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    public resultPage: ResultPage<ISimpleEventIntDto> = {};

    constructor(
        private _service: EventIntegrationService) {
    }

    load(
        pageIndex: number,
        pageSize: number,
        param: IFilterEventIntParam) {
        this.loadingSubject.next(true);
        this._service.filterResumen({
            pageIndex: pageIndex,
            pageSize: pageSize,
            param: param
        }).then((result: ResultPage<ISimpleEventIntDto>) => {
            new List<ISimpleEventIntDto>(result.elements).ForEach(x => {
                if (x.bSelected == null) {
                    x.bSelected = false;
                }
                if (!x.dFechaCreacion && x.fechaCreacion) {
                    x.dFechaCreacion = new Date(x.fechaCreacion);
                }
                if (!x.dFechaUltimoEnvio && x.fechaUltimoEnvio) {
                    x.dFechaUltimoEnvio = new Date(x.fechaUltimoEnvio);
                }
            });
            this.resultPage = result;
            this.dataResultSubject.next(result.elements);
            this.loadingSubject.next(false);
        }).catch(() => {
            this.loadingSubject.next(false);
        });
    }

    merge(list: ISimpleEventIntDto[]) {
        new List<ISimpleEventIntDto>(list).ForEach(x => {
            x.bSelected = false;
            if (!x.dFechaCreacion && x.fechaCreacion) {
                x.dFechaCreacion = new Date(x.fechaCreacion);
            }
            if (!x.dFechaUltimoEnvio && x.fechaUltimoEnvio) {
                x.dFechaUltimoEnvio = new Date(x.fechaUltimoEnvio);
            }
        });
        let exists = new List<ISimpleEventIntDto>(this.resultPage.elements);
        let updates = new List<ISimpleEventIntDto>(list);
        let elements: ISimpleEventIntDto[] = [];
        exists.ForEach(x => {
            const element = updates.FirstOrDefault(y => y.id === x.id);
            if (element) {
                elements.push(element);
            } else {
                elements.push(x);
            }
        });
        this.resultPage.elements = elements;
        this.dataResultSubject.next(this.resultPage.elements);
    }

    connect(collectionViewer: CollectionViewer): Observable<ISimpleEventIntDto[]> {
        return this.dataResultSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.dataResultSubject.complete();
        this.loadingSubject.complete();
    }
}