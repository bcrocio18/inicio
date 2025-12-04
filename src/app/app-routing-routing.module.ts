import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AperturaComponent } from './apertura/apertura.component';

const routes: Routes = [
  {path: '/apertura', component: AperturaComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingRoutingModule { }
