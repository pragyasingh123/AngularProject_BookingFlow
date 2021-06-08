import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertCentsToPound'
})

export class CentsToPoundPipe implements PipeTransform {

  transform(value: number): string {
    const beforedecimal: number = Math.floor((value/100));
    const afterdecimal: number = Math.floor(value%100);
    return "￡"+ beforedecimal + '.' + ('0'+afterdecimal).slice(-2);
  }
}