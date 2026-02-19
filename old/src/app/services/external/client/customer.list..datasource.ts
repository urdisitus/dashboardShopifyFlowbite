import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { ListResponseDto } from "src/app/models/external/list-response-dto";
import { CustomerDto } from "src/app/models/external/client/customer-dto";
import { ServiceShopifyCustomer } from "./shopify-customer-farmacorp.service";
import { SearchCustomerParam } from "src/app/models/external/client/search-customer-param";

@Injectable()
export class CustomerListDataSource implements DataSource<CustomerDto> {
    private subject = new BehaviorSubject<CustomerDto[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    public data : CustomerDto[] = [];        

    constructor(
        private _service: ServiceShopifyCustomer) {
    }

    orders(param: SearchCustomerParam) : Promise<ListResponseDto<CustomerDto>> {
        return new Promise((resolve) => {
            this.loadingSubject.next(true);
            this._service.search(param).then((result: ListResponseDto<CustomerDto>) => {
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

    connect(collectionViewer: CollectionViewer): Observable<CustomerDto[]> {        
        return this.subject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.subject.complete();
        this.loadingSubject.complete();
    }
}