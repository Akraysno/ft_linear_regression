import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LinearRegressionComponent } from './linear-regression/linear-regression.component';
import { SettingsComponent } from './linear-regression/settings/settings.component';
import { MaterialModule } from './material.module';
import { ButtonComponent } from './_components/button/button.component';
import { SnackbarComponent } from './_components/snackbar/snackbar.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ConfigurationComponent } from './linear-regression/configuration/configuration.component';
import { DragAndDropComponent } from './_components/drag-and-drop/drag-and-drop.component';
import { SizePipe } from './_pipes/size.pipe';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogComponent } from './_components/confirm-dialog/confirm-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LinearRegressionComponent,
    SettingsComponent,
    ButtonComponent,
    SnackbarComponent,
    ConfigurationComponent,
    DragAndDropComponent,
    SizePipe,
    ConfirmDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
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