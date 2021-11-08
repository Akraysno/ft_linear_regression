import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslateService } from '../_services/translate.service';

@Pipe({ name: 'size' })
export class SizePipe implements PipeTransform {
    constructor(
        private translateService: TranslateService,
    ) { }

    transform(bytes: number): any {
        const thresh = 1024;
        return new Observable(obs => {
            return this.translateService.language.subscribe(() => {
                let unit = this.translateService.getTranslationForKey('global.unit.byte')

                if (Math.abs(bytes) < thresh) {
                    obs.next(`${bytes} ${unit}`)
                } else {
                    const units = [`k${unit}`, `M${unit}`, `G${unit}`, `T${unit}`]
                    let u = -1;
                    const r = 10;

                    do {
                        bytes /= thresh;
                        ++u;
                    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


                    obs.next(`${bytes.toFixed(1)} ${units[u]}`)
                }
            }, err => obs.next())
        })

    }
}
