import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ProductosComponent } from './components/productos/productos.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { ServiciosComponent } from './components/servicios/servicios.component';
import { AuthGuard } from './guards/auth-guard';
import { LayoutComponent } from './components/layout/layout.component'; // 👈 Importar Layout
import { ContactoComponent } from './components/contacto/contacto.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent, // 👈 Usar LayoutComponent como contenedor
    canActivate: [AuthGuard],
    children: [
      { path: 'productos', component: ProductosComponent },
      { path: 'usuarios', component: UsuariosComponent },
      { path: 'servicios', component: ServiciosComponent },
      { path: 'contacto', component: ContactoComponent }
    ]
  }
];
