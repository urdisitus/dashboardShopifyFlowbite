import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nodata'
})
export class NodataPipe implements PipeTransform {

  transform(value: any): any {
    if (!value) {
      return '';
    }
    return value;
  }

}
