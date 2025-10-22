import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import LoginComponent from './login';
import { LoginService } from '../../app/services/login.service';

class LoginServiceMock {
  login(username: string, password: string) {
    // Simula éxito si hay valores y password >= 4
    return !!username && !!password && password.length >= 4;
  }
}

describe('LoginComponent', () => {
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: LoginService, useClass: LoginServiceMock },
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should invalidate empty form', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.form.setValue({ username: '', password: '' });
    expect(component.form.invalid).toBeTrue();
  });

  it('should login and navigate on valid credentials', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;
    const navigateSpy = spyOn(router, 'navigateByUrl');

    component.form.setValue({ username: 'fran', password: '1234' });
    component.onSubmit();

    expect(navigateSpy).toHaveBeenCalledWith('/');
  });

  it('should show alert on wrong credentials', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;
    const alertSpy = spyOn(window, 'alert');

    component.form.setValue({ username: 'fran', password: '123' }); // < 4 chars
    component.onSubmit();

    expect(alertSpy).toHaveBeenCalled();
  });
});
