import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth-guard';
import { AuthService } from '../services/auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['obtenerToken']);
    const routeSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routeSpy }
      ]
    });

    guard = TestBed.inject(AuthGuard);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('✅ debe permitir el acceso si hay token', () => {
    authServiceSpy.obtenerToken.and.returnValue('token_valido');
    expect(guard.canActivate()).toBeTrue();
  });

  it('🚫 debe bloquear el acceso si no hay token', () => {
    authServiceSpy.obtenerToken.and.returnValue(null);
    const result = guard.canActivate();
    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
