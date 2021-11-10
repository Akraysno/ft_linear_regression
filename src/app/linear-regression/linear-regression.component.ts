import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Config } from '../_classes/config.class';
import { DEFAULT_THEME, Themes, ThemesService } from '../_services/themes.service';

@Component({
  selector: 'app-linear-regression',
  templateUrl: './linear-regression.component.html',
  styleUrls: ['./linear-regression.component.scss']
})
export class LinearRegressionComponent implements OnInit {
  currentTheme: Themes = DEFAULT_THEME
  config!: Config

  themes = Themes

  theme$!: Subscription

  constructor(
    private themesService: ThemesService,
  ) { }

  ngOnInit(): void {
    this.theme$ = this.themesService.theme.subscribe(t => {
      this.currentTheme = t
    })
  }

  onConfigChange(config: Config) {
    this.config = config
  }

}