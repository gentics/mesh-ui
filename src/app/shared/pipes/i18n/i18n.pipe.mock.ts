import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'i18n'
})
export class MockI18nPipe implements PipeTransform {
    transform(arg: string) {
        return `translated ${arg}`;
    }
}
