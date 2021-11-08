import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DEFAULT_THEME, Themes, ThemesService } from '../_services/themes.service';

@Component({
  selector: 'app-linear-regression',
  templateUrl: './linear-regression.component.html',
  styleUrls: ['./linear-regression.component.scss']
})
export class LinearRegressionComponent implements OnInit {
  currentTheme: Themes = DEFAULT_THEME

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

}
