import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Añade Router
import { ApiService } from '../service/api.service';
import { MatDialog } from '@angular/material/dialog';
import { EpisodioModalComponent } from '../episodio-modal/episodio-modal.component';

@Component({
  selector: 'app-personaje-detalle',
  templateUrl: './personaje-detalle.component.html',
  styleUrls: ['./personaje-detalle.component.css']
})
export class PersonajeDetalleComponent implements OnInit {
  personaje: any = null;
  peliculas: any[] = [];
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router, // Inyecta Router
    private api: ApiService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];

    if (!id) {
      this.loading = false;
      return;
    }
    this.api.getPersonaje(id).subscribe({
      next: (data: any) => {
        this.personaje = data || { 
          name: 'Desconocido', 
          status: '-', 
          species: '-', 
          gender: '-' 
        };
      },
      error: () => {
        this.personaje = null;
        this.loading = false;
      }
    });

    this.api.getPeliculas(id).subscribe({
      next: (data: any[]) => {
        this.peliculas = data.length ? data : [];
        this.loading = false;
      },
      error: () => {
        this.peliculas = [];
        this.loading = false;
      }
    });
  }

  // Método actualizado para manejar Outputs del modal
  abrirModalPelicula(episodio: any): void {
    console.log('Abriendo modal para episodio:', episodio);
    
    const dialogRef = this.dialog.open(EpisodioModalComponent, {
      width: '700px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      data: { 
        episodio: episodio 
      }
    });

    // ESCUCHA LOS OUTPUTS DEL MODAL (afterClosed)
    dialogRef.afterClosed().subscribe(resultado => {
      console.log('Modal cerrado con resultado:', resultado);
      
      if (resultado?.accion === 'verPersonaje') {
        this.navegarAPersonaje(resultado.personajeId);
      }
      
      // Puedes manejar otros tipos de resultados aquí
      if (resultado?.tipo === 'favorito') {
        this.mostrarNotificacion('Episodio añadido a favoritos');
      }
    });

    // Si usaras @Output() directamente (menos común en dialogs)
    // dialogRef.componentInstance.personajeClick.subscribe(personajeId => {
    //   this.navegarAPersonaje(personajeId);
    // });
  }

  // Método para navegar a personaje (ejemplo de uso)
  navegarAPersonaje(personajeId: number): void {
    if (personajeId) {
      this.router.navigate(['/personaje', personajeId]);
    }
  }

  // Método para mostrar notificaciones
  mostrarNotificacion(mensaje: string): void {
    console.log('Notificación:', mensaje);
    // Aquí podrías integrar un servicio de notificaciones
    alert(mensaje); // Temporal
  }
}