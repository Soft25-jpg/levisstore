import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  usuarios: any[] = [];
  usuario: any = { username: '', email: '', password: '' };
  modoEdicion = false;
  mensaje = '';

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  obtenerUsuarios(): void {
    this.usuariosService.getUsuarios().subscribe({
      next: (data: any[]) => {        // ✅ Tipado explícito
        this.usuarios = data;
      },
      error: (err: any) => {          // ✅ Tipado explícito
        console.error('Error al obtener usuarios', err);
      }
    });
  }

  guardarUsuario(): void {
    if (this.modoEdicion) {
      this.usuariosService.updateUsuario(this.usuario._id, this.usuario).subscribe({
        next: (): void => {
          this.mensaje = 'Usuario actualizado correctamente';
          this.modoEdicion = false;
          this.usuario = { username: '', email: '', password: '' };
          this.obtenerUsuarios();
        },
        error: (err: any): void => {
          console.error('Error al actualizar usuario', err);
        }
      });
    } else {
      this.usuariosService.createUsuario(this.usuario).subscribe({
        next: (): void => {
          this.mensaje = 'Usuario agregado correctamente';
          this.usuario = { username: '', email: '', password: '' };
          this.obtenerUsuarios();
        },
        error: (err: any): void => {
          console.error('Error al agregar usuario', err);
        }
      });
    }
  }

  editarUsuario(usuario: any): void {
    this.usuario = { ...usuario };
    this.modoEdicion = true;
  }

  eliminarUsuario(id: string): void {
    if (confirm('¿Seguro que deseas eliminar este usuario?')) {
      this.usuariosService.deleteUsuario(id).subscribe({
        next: (): void => {
          this.mensaje = 'Usuario eliminado correctamente';
          this.obtenerUsuarios();
        },
        error: (err: any): void => {
          console.error('Error al eliminar usuario', err);
        }
      });
    }
  }

  cancelarEdicion(): void {
    this.modoEdicion = false;
    this.usuario = { username: '', email: '', password: '' };
  }
}
