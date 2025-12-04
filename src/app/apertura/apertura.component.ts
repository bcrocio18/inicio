import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-apertura',
  templateUrl: './apertura.component.html',
  styleUrls: ['./apertura.component.css']
})
export class AperturaComponent {

  constructor(private router: Router) {}

  irAInicio() {
    this.router.navigate(['/inicio']);
  }
}
