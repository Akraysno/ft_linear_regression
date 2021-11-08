import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LinearRegressionComponent } from './linear-regression/linear-regression.component';

const routes: Routes = [{
  path: '',
  component: LinearRegressionComponent,
  pathMatch: 'full'
}, {
  path: '**',
  redirectTo: ''
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
