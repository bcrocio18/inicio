import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { PersonajeDetalleComponent } from './personaje-detalle/personaje-detalle.component';

const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'personaje/:id', component: PersonajeDetalleComponent },
  
  // Redirección para rutas no encontradas
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // Opción 1: Usar hash routing (más compatible)
    useHash: true
    
    // Opción 2: HTML5 routing (requiere configuración de servidor)
    // useHash: false
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }