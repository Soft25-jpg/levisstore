import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  esAdmin = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.esAdmin = this.authService.esAdmin();
  }

  cerrarSesion(): void {
    this.authService.cerrarSesion();
    this.router.navigate(['/login']);
  }
}
