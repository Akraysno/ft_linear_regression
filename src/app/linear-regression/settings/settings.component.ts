import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { Settings } from 'src/app/_classes/settings.class';
import { Themes, ThemesService, DEFAULT_THEME } from 'src/app/_services/themes.service';
import { Languages, TranslateService, DEFAULT_LANGUAGE } from 'src/app/_services/translate.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: [
    './settings.component.scss',
    '../menu.scss'
  ],
  encapsulation: ViewEncapsulation.None,
})
export class SettingsComponent implements OnInit {
  @Output() onSettingsChange: EventEmitter<Settings> = new EventEmitter()
  settings!: Settings
  currentLanguage: Languages = DEFAULT_LANGUAGE
  currentTheme: Themes = DEFAULT_THEME

  themes = Themes
  languages = Languages

  language$!: Subscription | null
  theme$!: Subscription | null

  constructor(
    private translateService: TranslateService,
    private themesService: ThemesService,
  ) { }

  ngOnInit(): void {
    this.settings = new Settings()
    this.onSettingsChange.emit(this.settings)
    this.language$ = this.translateService.language.subscribe(language => this.currentLanguage = language)
    this.theme$ = this.themesService.theme.subscribe(theme => this.currentTheme = theme)
  }

  updateLanguage(language: Languages) {
    this.translateService.setTranslations(language)
  }

  updateTheme(theme: Themes) {
    this.themesService.setTheme(theme)
  }

  ngOnDestroy() {
    if (this.language$) {
      this.language$.unsubscribe()
      this.language$ = null
    }
    if (this.theme$) {
      this.theme$.unsubscribe()
      this.theme$ = null
    }
  }
}
