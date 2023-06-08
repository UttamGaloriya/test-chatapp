import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textlength'
})
export class TextlengthPipe implements PipeTransform {

  transform(value: any, numlenght: number): unknown {
    if (value.length > numlenght) {
      return value.slice(0, numlenght) + '...'
    }
    return value;
  }

}
