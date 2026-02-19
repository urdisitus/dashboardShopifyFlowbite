import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { OrderListItemDto } from "src/app/models/external/order/order-list-item-dto";
import { ServiceOrderList } from "./order.list.service";
import { GetOrdersParam } from "src/app/models/external/order/get-orders-param";
import { ListResponseDto } from "src/app/models/external/list-response-dto";

@Injectable()
export class OrderListDataSource implements DataSource<OrderListItemDto> {
    private subject = new BehaviorSubject<OrderListItemDto[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    public data : OrderListItemDto[] = [];        

    constructor(
        private _service: ServiceOrderList) {
    }

    orders(param: GetOrdersParam) : Promise<ListResponseDto<OrderListItemDto>> {
        return new Promise((resolve) => {
            this.loadingSubject.next(true);
            this._service.orders(param).then((result: ListResponseDto<OrderListItemDto>) => {
                result.data.forEach(element => {
                    this.data.push(element);
                });         
                this.updateData();
                this.loadingSubject.next(false);
                resolve(result);
            }).catch(()=>{
                this.loadingSubject.next(false);  
            });            
        });        
    }

    updateData(){
        this.subject.next(this.data);
    }

    connect(collectionViewer: CollectionViewer): Observable<OrderListItemDto[]> {        
        return this.subject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.subject.complete();
        this.loadingSubject.complete();
    }
}