import { Pipe, PipeTransform } from '@angular/core';
import { ISector } from '@apptypes/entities/sector';

@Pipe({
  name: 'sectorsPipe'
})
export class SectorsPipePipe implements PipeTransform {

  transform(value: ISector | ISector[], defaultStr: string = 'No aplica'): any {

    if (!(value instanceof Array))
      return value.name;

    if(value.length == 0) return defaultStr; 
    return value.map(sector => sector.name).join('/');
  }

}
