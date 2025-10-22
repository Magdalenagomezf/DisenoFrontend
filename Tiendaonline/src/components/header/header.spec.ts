import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Header } from './header';
import { LoginService } from '../../app/services/login.service';

class MockLoginService {
  isLoggedIn = jasmine.createSpy('isLoggedIn').and.returnValue(true);
  currentUser = jasmine.createSpy('currentUser').and.returnValue({ username: 'fran' });
  logout = jasmine.createSpy('logout');
}

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;
  let router: Router;
  let auth: MockLoginService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header, RouterTestingModule],
      providers: [{ provide: LoginService, useClass: MockLoginService }]
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    auth = TestBed.inject(LoginService) as unknown as MockLoginService;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should logout and navigate home', () => {
    const navSpy = spyOn(router, 'navigateByUrl');
    component.logout();
    expect(auth.logout).toHaveBeenCalled();
    expect(navSpy).toHaveBeenCalledWith('/');
  });

  it('should toggle menu', () => {
    expect(component.open).toBeFalse();
    component.toggle();
    expect(component.open).toBeTrue();
    component.close();
    expect(component.open).toBeFalse();
  });
});
