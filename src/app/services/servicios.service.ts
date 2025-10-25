import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {
  private apiUrl = 'http://localhost:3000/api/servicios';

  constructor(private http: HttpClient) {}

  obtenerServicios(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  obtenerServicio(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  crearServicio(servicioData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, servicioData);
  }

  actualizarServicio(id: string, servicioData: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, servicioData);
  }

  eliminarServicio(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
