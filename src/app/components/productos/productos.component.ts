import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '../../services/productos.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  productos: any[] = [];
  producto: any = { name: '', description: '', price: null, stock: null, category: '' };
  modoEdicion = false;
  esAdmin = false;
  selectedFile: File | null = null;
  mensaje = '';

  constructor(
    private productoService: ProductoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.obtenerProductos();
    this.esAdmin = this.authService.esAdmin();
  }

  obtenerProductos(): void {
    this.productoService.obtenerProductos().subscribe({
      next: (data) => {
        this.productos = data.map(p => ({
          ...p,
          // Asegura que la URL de la imagen sea siempre correcta
          imageUrl: p.imageUrl ? `http://localhost:3000/${p.imageUrl}` : null
        }));
      },
      error: (err) => this.mensaje = 'Error al cargar productos.'
    });
  }

  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  guardarProducto(): void {
    const formData = new FormData();
    Object.keys(this.producto).forEach(key => {
      if (this.producto[key] !== null) {
        formData.append(key, this.producto[key]);
      }
    });

    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

    if (this.modoEdicion) {
      // Actualizar producto
      this.productoService.actualizarProducto(this.producto._id, formData).subscribe({
        next: (productoActualizado) => {
          this.mensaje = 'Producto actualizado con éxito.';
          // Actualiza el producto en la lista local
          const index = this.productos.findIndex(p => p._id === this.producto._id);
          if (index !== -1) {
            this.productos[index] = {
              ...productoActualizado,
              imageUrl: productoActualizado.imageUrl ? `http://localhost:3000/${productoActualizado.imageUrl}` : this.productos[index].imageUrl
            };
          }
          this.cancelarEdicion();
        },
        error: (err) => this.mensaje = 'Error al actualizar el producto.'
      });
    } else {
      // Crear producto
      this.productoService.crearProducto(formData).subscribe({
        next: (nuevoProducto) => {
          this.mensaje = 'Producto creado con éxito.';
          // Agrega el nuevo producto a la lista local
          this.productos.push({
            ...nuevoProducto,
            imageUrl: nuevoProducto.imageUrl ? `http://localhost:3000/${nuevoProducto.imageUrl}` : null
          });
          this.cancelarEdicion(); // Limpia el formulario
        },
        error: (err) => this.mensaje = 'Error al crear el producto.'
      });
    }
  }

  editarProducto(producto: any): void {
    this.modoEdicion = true;
    // Clonamos el objeto para no modificar el original en la lista directamente
    this.producto = { ...producto };
    // Quitamos la URL completa para no enviarla de vuelta
    delete this.producto.imageUrl;
    window.scrollTo(0, 0); // Sube al inicio de la página para ver el formulario
  }

  eliminarProducto(id: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      this.productoService.eliminarProducto(id).subscribe({
        next: () => {
          this.mensaje = 'Producto eliminado con éxito.';
          // Filtra el producto eliminado de la lista local
          this.productos = this.productos.filter(p => p._id !== id);
        },
        error: (err) => this.mensaje = 'Error al eliminar el producto.'
      });
    }
  }

  cancelarEdicion(): void {
    this.modoEdicion = false;
    this.producto = { name: '', description: '', price: null, stock: null, category: '' };
    this.selectedFile = null;
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
}
