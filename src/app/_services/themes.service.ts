import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export enum Themes {
    DARK = 'DARK',
    LIGHT = 'LIGHT',
}

export const DEFAULT_THEME = Themes.DARK
const LOCAL_STORAGE_THEME_KEY = 'gauffret_rubik_theme'

@Injectable({ providedIn: 'root' })
export class ThemesService {
    theme: BehaviorSubject<Themes> = new BehaviorSubject<Themes>(DEFAULT_THEME)

    constructor() {
        this.initTheme()
    }

    initTheme() {
        let theme = Themes[localStorage.getItem(LOCAL_STORAGE_THEME_KEY) as Themes || Themes.DARK]
        if (!theme) {
            theme = DEFAULT_THEME
        }
        this.setTheme(theme)
    }

    currenTheme() {
        return localStorage.getItem(LOCAL_STORAGE_THEME_KEY)
    }

    setTheme(theme: Themes) {
        if (!theme) {
            theme = DEFAULT_THEME
        }
        localStorage.setItem(LOCAL_STORAGE_THEME_KEY, theme)
        this.theme.next(theme)
    }

}