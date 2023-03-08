import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "subStr"
})
export class SubStrPipe implements PipeTransform {
  transform(value: string, start = 0, length = 25, optionalStr = '...', args?: any): any {

    if(value.length <= length){
      return value;
    }

    return `${value.substr(start,length)}${optionalStr}`
  }
}
