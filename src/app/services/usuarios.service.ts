import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private apiUrl = 'http://localhost:3000/api/usuarios';

  constructor(private http: HttpClient) {}

  // ✅ Métodos que coinciden con los usados en tu componente
  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getUsuario(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createUsuario(usuario: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, usuario);
  }

  updateUsuario(id: string, usuario: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, usuario);
  }

  deleteUsuario(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
