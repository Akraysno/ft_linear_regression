import { NgModule } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
    exports: [
        MatSnackBarModule,
        MatButtonModule,
        MatSlideToggleModule,
        MatSliderModule,
        MatSidenavModule,
        MatProgressSpinnerModule,
    ]
})
export class MaterialModule { }
