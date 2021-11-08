import { Injectable } from '@angular/core';
import { TranslateService as Translate } from '@ngx-translate/core';
import { Observable, BehaviorSubject } from 'rxjs';

export enum Languages {
    fr = 'fr',
    en = 'en',
}

export const DEFAULT_LANGUAGE = Languages.fr
const LOCAL_STORAGE_LANGUAGE_KEY = 'gauffret_rubik_language'

@Injectable({ providedIn: 'root' })
export class TranslateService {
    currentTranslations: BehaviorSubject<any> = new BehaviorSubject({})
    language: BehaviorSubject<Languages> = new BehaviorSubject<Languages>(DEFAULT_LANGUAGE)
    translations: any = {};

    constructor(
        public translate: Translate,
    ) {
        this.initTranslations()
    }

    initTranslations() {
        let language = localStorage.getItem(LOCAL_STORAGE_LANGUAGE_KEY) as Languages || Languages.en
        let lang = Languages[language];
        if (!lang) {
            lang = DEFAULT_LANGUAGE
        }
        this.setTranslations(lang);
    }

    setTranslations(lang: Languages) {
        if (!lang) {
            lang = DEFAULT_LANGUAGE
        }
        localStorage.setItem(LOCAL_STORAGE_LANGUAGE_KEY, lang);
        this.translate.setDefaultLang(DEFAULT_LANGUAGE);
        this.translate.use(lang);
        this.translate.reloadLang(lang).subscribe((translations) => {
            this.translations = translations;
            this.currentTranslations.next(translations)
            this.language.next(lang)
        })
    }

    get(keys: string | string[], values?: any) {
        return this.translate.get(keys, values)
    }

    getTranslationForKey(key: string) {
        return this.getValueInObject(key, this.translations) || key
    }

    getTranslationForKeyWithValues(key: string, values: any) {
        return new Observable((obs) => {
            this.get(key, values).subscribe(res => {
                if (!res) {
                    obs.next(key)
                    obs.complete()
                } else {
                    obs.next(res)
                    obs.complete()
                }
            }, err => {
                obs.next(key)
                obs.complete()
            })
        })
    }

    currentLanguage() {
        return localStorage.getItem(LOCAL_STORAGE_LANGUAGE_KEY);
    }

    private getValueInObject(key: string, obj: any) {
        let regexKey = new RegExp(/^([a-zA-Z0-9]+)(\.[a-zA-Z0-9]+)*$/)
        let value = undefined

        if (key.match(regexKey)) {
            let keys: string[] = key && key.length ? key.split('.') : []
            let actualStep: any = obj

            while (keys.length && actualStep) {
                let currentKey = keys.shift()
                if (currentKey) {
                    actualStep = actualStep[currentKey]
                    if (keys.length === 0) {
                        value = actualStep
                        break
                    }
                }
            }
        }

        return value
    }
}