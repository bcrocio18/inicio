import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { authInterceptor } from './service/ul/auth.interceptor';
import { MatIconModule } from '@angular/material/icon';


import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// IMPORTA tus componentes

import { InicioComponent } from './inicio/inicio.component';

@NgModule({
  declarations: [
    AppComponent,
    InicioComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MatIconModule,
    ReactiveFormsModule,
    AppRoutingModule // IMPORTANTE
  ],
  providers: [
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }



