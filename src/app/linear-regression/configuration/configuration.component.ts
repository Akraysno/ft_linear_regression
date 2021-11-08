import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle/slide-toggle'
import { MatSliderChange } from '@angular/material/slider/slider'
import { ThemesService, DEFAULT_THEME, Themes } from 'src/app/_services/themes.service';
import { Subscription } from 'rxjs';
import { LinearRegressionService } from '../linear-regression.service';
import { Config } from 'src/app/_classes/config.class';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: [
    './configuration.component.scss',
    '../menu.scss'
  ],
  encapsulation: ViewEncapsulation.None,
})
export class ConfigurationComponent implements OnInit {
  @Output() onConfigChange: EventEmitter<Config> = new EventEmitter()
  config!: Config
  currentTheme: Themes = DEFAULT_THEME

  themes = Themes

  theme$!: Subscription | null

  constructor(
    private linearRegressionService: LinearRegressionService,
    private themesService: ThemesService,
  ) { }

  ngOnInit(): void {
    this.config = new Config()
    this.onConfigChange.emit(this.config)
    this.theme$ = this.themesService.theme.subscribe(theme => this.currentTheme = theme)
  }

  onUpdate() {
    this.onConfigChange.emit(this.config)
    this.linearRegressionService.config.next(this.config)
  }

  ngOnDestroy() {
    if (this.theme$) {
      this.theme$.unsubscribe()
      this.theme$ = null
    }
  }

}
