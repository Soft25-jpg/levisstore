// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface LoginResp {
  token: string;
  user?: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

  login(credentials: { username: string; password: string }): Observable<LoginResp> {
    return this.http.post<LoginResp>(`${this.apiUrl}/login`, credentials);
  }
// Registrar un nuevo usuario
register(userData: { username: string; email: string; password: string; role?: string }) {
  return this.http.post<any>(`${this.apiUrl}/register`, userData);
}




  guardarToken(token: string) {
    localStorage.setItem('token', token);
  }

  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }

  guardarUsuario(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  obtenerUsuario(): any | null {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  }

  cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  estaAutenticado(): boolean {
    return !!this.obtenerToken();
  }

  esAdmin(): boolean {
    const u = this.obtenerUsuario();
    return u && u.role === 'admin';
  }

  // (opcional) extraer datos del payload del JWT sin librería
  getPayloadFromToken(): any | null {
    const token = this.obtenerToken();
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
      const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(json);
    } catch (e) {
      return null;
    }
  }
}

