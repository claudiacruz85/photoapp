import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'placeholder',
})
export class PlaceholderPipe implements PipeTransform {

  transform( value: string, defecto:string = "titulo" ) {

    return (value) ? value : defecto;
  }
}
