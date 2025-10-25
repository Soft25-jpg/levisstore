import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ServicioService } from '../../services/servicios.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.css']
})
export class ServiciosComponent implements OnInit {
  servicios: any[] = [];
  servicio: any = { name: '', description: '', price: null };
  modoEdicion = false;
  esAdmin = false;
  selectedFile: File | null = null;
  mensaje = '';

  constructor(
    private servicioService: ServicioService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.obtenerServicios();
    this.esAdmin = this.authService.esAdmin();
  }

  obtenerServicios(): void {
    this.servicioService.obtenerServicios().subscribe({
      next: (data) => {
        this.servicios = data.map(s => ({
          ...s,
          imageUrl: s.imageUrl ? `http://localhost:3000/${s.imageUrl}` : null
        }));
      },
      error: (err) => this.mensaje = 'Error al cargar servicios.'
    });
  }

  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  guardarServicio(): void {
    const formData = new FormData();
    Object.keys(this.servicio).forEach(key => {
      if (this.servicio[key] !== null) {
        formData.append(key, this.servicio[key]);
      }
    });

    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

    if (this.modoEdicion) {
      this.servicioService.actualizarServicio(this.servicio._id, formData).subscribe({
        next: (servicioActualizado) => {
          this.mensaje = 'Servicio actualizado con éxito.';
          const index = this.servicios.findIndex(s => s._id === this.servicio._id);
          if (index !== -1) {
            this.servicios[index] = {
              ...servicioActualizado,
              imageUrl: servicioActualizado.imageUrl ? `http://localhost:3000/${servicioActualizado.imageUrl}` : this.servicios[index].imageUrl
            };
          }
          this.cancelarEdicion();
        },
        error: (err) => this.mensaje = 'Error al actualizar el servicio.'
      });
    } else {
      this.servicioService.crearServicio(formData).subscribe({
        next: (nuevoServicio) => {
          this.mensaje = 'Servicio creado con éxito.';
          this.servicios.push({
            ...nuevoServicio,
            imageUrl: nuevoServicio.imageUrl ? `http://localhost:3000/${nuevoServicio.imageUrl}` : null
          });
          this.cancelarEdicion();
        },
        error: (err) => this.mensaje = 'Error al crear el servicio.'
      });
    }
  }

  editarServicio(servicio: any): void {
    this.modoEdicion = true;
    this.servicio = { ...servicio };
    delete this.servicio.imageUrl;
    window.scrollTo(0, 0);
  }

  eliminarServicio(id: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
      this.servicioService.eliminarServicio(id).subscribe({
        next: () => {
          this.mensaje = 'Servicio eliminado con éxito.';
          this.servicios = this.servicios.filter(s => s._id !== id);
        },
        error: (err) => this.mensaje = 'Error al eliminar el servicio.'
      });
    }
  }

  cancelarEdicion(): void {
    this.modoEdicion = false;
    this.servicio = { name: '', description: '', price: null };
    this.selectedFile = null;
    const fileInput = document.getElementById('file-input-servicio') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
}



