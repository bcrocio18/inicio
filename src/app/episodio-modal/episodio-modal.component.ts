import { Component, Inject, HostBinding, Output, EventEmitter } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-episodio-modal',
  templateUrl: './episodio-modal.component.html',
  styleUrls: ['./episodio-modal.component.css'],
  animations: [
    trigger('slideInAnimation', [
      transition(':enter', [
        style({ 
          transform: 'translateY(-30px) scale(0.95)', 
          opacity: 0 
        }),
        animate('300ms cubic-bezier(0.35, 0, 0.25, 1)', 
          style({ 
            transform: 'translateY(0) scale(1)', 
            opacity: 1 
          })
        )
      ]),
      transition(':leave', [
        animate('200ms cubic-bezier(0.35, 0, 0.25, 1)', 
          style({ 
            transform: 'translateY(-20px)', 
            opacity: 0 
          })
        )
      ])
    ])
  ]
})
export class EpisodioModalComponent {
  // DATOS QUE ENTRAN (INPUT equivalente con MAT_DIALOG_DATA)
  episodio: any;
  
  // EVENTOS QUE SALEN (OUTPUTS)
  @Output() personajeClick = new EventEmitter<number>(); // Cuando se hace click en un personaje
  @Output() episodioGuardado = new EventEmitter<any>();  // Para guardar cambios
  @Output() episodioFavorito = new EventEmitter<any>();  // Para marcar como favorito
  
  // Vincula la animación al host
  @HostBinding('@slideInAnimation')
  slideInAnimation = true;

  // Propiedades adicionales para demostración
  esFavorito: boolean = false;
  notasPersonales: string = '';

  constructor(
    public dialogRef: MatDialogRef<EpisodioModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // INPUT: Los datos entran por aquí (equivalente a @Input)
    this.episodio = data?.episodio || {};
    
    // Inicializar propiedades
    this.esFavorito = localStorage.getItem(`favorito_${this.episodio.id}`) === 'true';
    this.notasPersonales = localStorage.getItem(`notas_${this.episodio.id}`) || '';
  }


  // Método para cerrar (OUTPUT implícito)
  cerrar(): void {
    this.dialogRef.close();
  }

  // Método con OUTPUT personalizado
  onPersonajeClick(personajeId: number): void {
    console.log(`Personaje ${personajeId} clickeado`);
    
    // EMITE el evento OUTPUT
    this.personajeClick.emit(personajeId);
    
    // También puedes cerrar el modal con datos
    this.dialogRef.close({ 
      accion: 'verPersonaje', 
      personajeId: personajeId 
    });
  }

  // Otro OUTPUT: Marcar como favorito
  toggleFavorito(): void {
    this.esFavorito = !this.esFavorito;
    
    // Guardar en localStorage
    localStorage.setItem(`favorito_${this.episodio.id}`, this.esFavorito.toString());
    
    // EMITE el evento OUTPUT
    this.episodioFavorito.emit({
      episodioId: this.episodio.id,
      esFavorito: this.esFavorito
    });
    
    console.log(`Episodio ${this.episodio.id} marcado como favorito: ${this.esFavorito}`);
  }

  // Método auxiliar
  extraerIdPersonaje(url: string): number {
    if (!url || typeof url !== 'string') return 0;
    const partes = url.split('/');
    const id = parseInt(partes[partes.length - 1]);
    return isNaN(id) ? 0 : id;
  }

  
  // TrackBy para mejorar rendimiento
  trackByPersonaje(index: number, url: string): string {
    return url;
  }
}