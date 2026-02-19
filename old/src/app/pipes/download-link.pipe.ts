import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'downloadLink'
})
export class DownloadLinkPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer ) {}
  transform(value: any): any {
    const blob = new Blob([value || 'No existen datos'], { type: 'application/octet-stream' });
    return this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
  }

}
