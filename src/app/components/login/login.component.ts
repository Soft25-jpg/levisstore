// src/app/components/login/login.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  confirmPassword = '';
  email = '';
  role = 'user';
  errorMessage = '';
  modoRegistro = false; // 👈 empieza en modo login

  constructor(private authService: AuthService, private router: Router) {}

  // 🔹 alterna entre login y registro
  toggleModo() {
    this.modoRegistro = !this.modoRegistro;
    this.errorMessage = '';
  }

  // 🔹 inicio de sesión
  onSubmit() {
    const credenciales = {
      username: this.username,
      password: this.password
    };

    this.authService.login(credenciales).subscribe({
      next: (resp) => {
        this.authService.guardarToken(resp.token);
        this.authService.guardarUsuario(resp.user);
        alert('✅ Inicio de sesión exitoso');
        
        if (resp.user && resp.user.role === 'admin') {
          this.router.navigate(['/usuarios']);
        } else {
          this.router.navigate(['/productos']);
        }
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = '❌ Usuario o contraseña incorrectos';
      }
    });
  }

  // 🔹 registro de nuevo usuario
  onRegister() {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    const newUser = {
      username: this.username,
      email: this.email,
      password: this.password,
      role: this.role
    };

    this.authService.register(newUser).subscribe({
      next: () => {
        alert('✅ Registro exitoso. Ahora puedes iniciar sesión.');
        this.toggleModo(); // vuelve al login
        this.username = '';
        this.password = '';
        this.confirmPassword = '';
        this.email = '';
        this.errorMessage = '';
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = '❌ Error al registrar el usuario';
      }
    });
  }
}
