import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LinearRegressionComponent } from './linear-regression/linear-regression.component';
import { SettingsComponent } from './linear-regression/settings/settings.component';
import { MaterialModule } from './material.module';
import { SnackbarService } from './_services/snackbar.service';
import { ErrorsService } from './_services/errors.service';
import { TranslateService } from './_services/translate.service';
import { ThemesService } from './_services/themes.service';
import { ButtonComponent } from './_components/button/button.component';
import { SnackbarComponent } from './_components/snackbar/snackbar.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ConfigurationComponent } from './linear-regression/configuration/configuration.component';

@NgModule({
  declarations: [
    AppComponent,
    LinearRegressionComponent,
    SettingsComponent,
    ButtonComponent,
    SnackbarComponent,
    ConfigurationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}