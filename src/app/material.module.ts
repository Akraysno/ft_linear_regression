import { NgModule } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
    exports: [
        MatSnackBarModule,
        MatButtonModule,
        MatSlideToggleModule,
        MatSliderModule,
        MatSidenavModule,
        MatProgressSpinnerModule,
        MatInputModule,
        MatDialogModule,
        ClipboardModule,
        MatTooltipModule,
    ]
})
export class MaterialModule { }
