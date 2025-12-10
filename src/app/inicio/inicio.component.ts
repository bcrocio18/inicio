import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html', 
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  data: any[] = [];
  fakeDB: any[] = [];

  mostrarModal = false;
  mostrarDetallesModal = false;
  modoEdicion = false;

  personajeSeleccionado: any = null;
  personajeDetalle: any = null;

  nuevoPersonaje = {
    name: '',
    status: '',
    species: '',
    gender: '',
    origin: '',
    location: ''
  };

  constructor(private api: ApiService) {}

  ngOnInit() {
    // Traer personajes reales
    this.api.getData().subscribe({
      next: (res) => {
        console.log("Respuesta API:", res);
        this.data = Array.isArray(res) ? res : [res];
      },
      error: (err) => console.error("Error:", err)
    });

    // Traer personajes simulados
    this.api.getFakeDB().subscribe(db => this.fakeDB = db);
  }

  // Métodos para selección
  seleccionarPersonaje(personaje: any) {
    if (this.personajeSeleccionado?.id === personaje.id) {
      this.personajeSeleccionado = null;
    } else {
      this.personajeSeleccionado = personaje;
    }
  }

  esDeAPI(personaje: any): boolean {
    return personaje.id < 1000;
  }

  // Métodos para acciones
  verDetalles(personaje: any) {
    this.personajeDetalle = { ...personaje };
    this.mostrarDetallesModal = true;
  }

  cerrarDetallesModal() {
    this.mostrarDetallesModal = false;
    this.personajeDetalle = null;
  }

  editarPersonaje(personaje: any) {
    this.nuevoPersonaje = {
      name: personaje.name,
      status: personaje.status,
      species: personaje.species,
      gender: personaje.gender,
      origin: personaje.origin?.name || personaje.origin || '',
      location: personaje.location?.name || personaje.location || ''
    };
    this.personajeSeleccionado = personaje;
    this.modoEdicion = true;
    this.mostrarModal = true;
 
  }

eliminarPersonaje(personaje: any) {
  Swal.fire({
    title: '¿Eliminar personaje?',
    text: `Se eliminará a "${personaje.name}".`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6'
  }).then((result) => {
    if (result.isConfirmed) {

      if (this.esDeAPI(personaje)) {
        Swal.fire({
          icon: 'error',
          title: 'No permitido',
          text: 'Los personajes de la API no se pueden eliminar'
        });
        return;
      }

      const index = this.fakeDB.findIndex(p => p.id === personaje.id);
      if (index > -1) {
        this.fakeDB.splice(index, 1);
        localStorage.setItem('fakeDB', JSON.stringify(this.fakeDB));
        this.personajeSeleccionado = null;
      }
    }
  });
}


  // Métodos para el modal
  abrirModal() {
    this.nuevoPersonaje = {
      name: '',
      status: '',
      species: '',
      gender: '',
      origin: '',
      location: ''
    };
    this.modoEdicion = false;
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.modoEdicion = false;
    this.personajeSeleccionado = null;
  }

  crearPersonaje() {
    if (!this.nuevoPersonaje.name) return;

    const personajeParaGuardar = {
      name: this.nuevoPersonaje.name,
      status: this.nuevoPersonaje.status,
      species: this.nuevoPersonaje.species,
      gender: this.nuevoPersonaje.gender,
      origin: this.nuevoPersonaje.origin ? { name: this.nuevoPersonaje.origin } : undefined,
      location: this.nuevoPersonaje.location ? { name: this.nuevoPersonaje.location } : undefined
    };

    this.api.createCharacter(personajeParaGuardar).subscribe(res => {
      console.log("POST simulado:", res);
      this.api.getFakeDB().subscribe(db => this.fakeDB = db);
      this.cerrarModal();
    });
  }

  actualizarPersonaje() {
    if (!this.nuevoPersonaje.name || !this.personajeSeleccionado) return;

    // Solo se pueden editar personajes de fakeDB
    if (this.esDeAPI(this.personajeSeleccionado)) {
      Swal.fire({
        icon: 'error',
        title: 'No permitido',
        text: 'Los personajes de la API no se pueden editar.'
      });
      this.cerrarModal();
      return;
    }

    const index = this.fakeDB.findIndex(p => p.id === this.personajeSeleccionado.id);
    if (index > -1) {
      this.fakeDB[index] = {
        ...this.fakeDB[index],
        name: this.nuevoPersonaje.name,
        status: this.nuevoPersonaje.status,
        species: this.nuevoPersonaje.species,
        gender: this.nuevoPersonaje.gender,
        origin: this.nuevoPersonaje.origin ? { name: this.nuevoPersonaje.origin } : undefined,
        location: this.nuevoPersonaje.location ? { name: this.nuevoPersonaje.location } : undefined

      };
      
      // Actualizar localStorage
      localStorage.setItem('fakeDB', JSON.stringify(this.fakeDB));
      
      this.cerrarModal();

    }
  }
}