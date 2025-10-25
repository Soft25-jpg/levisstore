import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent {
  formData: any = {
    name: '',
    email: '',
    message: ''
  };
  mensaje = '';
  error = '';

  constructor(private http: HttpClient) {}

  enviarMensaje() {
    this.mensaje = '';
    this.error = '';

    // Objeto que se enviará a Web3Forms
    const data = {
      ...this.formData,
      access_key: 'e58a4a00-b3ad-4a52-9074-ffda9d2293b4', // Tu clave de acceso
      subject: 'Nuevo Mensaje desde tu Portafolio', // Asunto del correo
      from_name: 'Notificación de Contacto', // Nombre que verás como remitente
    };

    this.http.post('https://api.web3forms.com/submit', data)
      .subscribe({
        next: (res: any) => {
          this.mensaje = res.message || '¡Mensaje enviado con éxito!';
          // Limpiar formulario
          this.formData = { name: '', email: '', message: '' };
        },
        error: (err) => {
          console.error(err);
          this.error = 'Hubo un error al enviar el mensaje. Inténtalo de nuevo.';
        }
      });
  }
}
