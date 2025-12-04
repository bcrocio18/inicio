import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AperturaComponent } from './apertura/apertura.component';
import { InicioComponent } from './inicio/inicio.component';

const routes: Routes = [
  { path: '', redirectTo: '/apertura', pathMatch: 'full' },
  { path: 'inicio', component: InicioComponent },
  { path: 'apertura', component: AperturaComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
