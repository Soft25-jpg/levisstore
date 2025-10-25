import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = 'http://localhost:3000/api/productos'; // Cambia si tu backend usa otra ruta

  constructor(private http: HttpClient) {}

  obtenerProductos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  obtenerProducto(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Se envía FormData, no un JSON.
  crearProducto(productoData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, productoData);
  }

  // Lo mismo para actualizar
  actualizarProducto(id: string, productoData: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, productoData);
  }

  eliminarProducto(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  increaseStock(id: string, amount: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/increase-stock`, { amount });
  }

  decreaseStock(id: string, amount: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/decrease-stock`, { amount });
  }
}
