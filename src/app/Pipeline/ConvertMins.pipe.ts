import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hoursMins'
})

export class MinuteSecondsPipe implements PipeTransform {

  transform(value: number): string {
    const hours: number = Math.floor((value/60));
    const minutes: number = Math.floor(value%60);
    return ('0'+hours).slice(-2) + ':' + ('0'+minutes).slice(-2) +'hrs';
  }
}