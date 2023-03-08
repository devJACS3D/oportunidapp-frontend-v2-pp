import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'replace'
})

export class JoinStringPipe implements PipeTransform {
    transform(value: string[], char: string = ',', replace: string = ', ') {
        let respValue: string[] = value;
        if(respValue.length){
            return respValue.join(", ");
        }

        return respValue;
    }
}