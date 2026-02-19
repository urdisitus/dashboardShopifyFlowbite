import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormatEs'
})
export class DateFormatEsPipe implements PipeTransform {

  transform(value: string): any {
    if (value === undefined) {
      return '';
    }
    if ( !value ) {
      return '';
    }
    return new Date( value );
  }

}
