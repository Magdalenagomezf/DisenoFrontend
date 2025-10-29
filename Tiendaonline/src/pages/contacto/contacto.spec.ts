import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import ContactoPage from './contacto';
import { By } from '@angular/platform-browser';

describe('ContactoPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactoPage, NoopAnimationsModule]
    }).compileComponents();
  });

  it('debe crear el componente', () => {
    const fixture = TestBed.createComponent(ContactoPage);
    const comp = fixture.componentInstance;
    expect(comp).toBeTruthy();
  });

  it('debe invalidar el formulario cuando está vacío', () => {
    const fixture = TestBed.createComponent(ContactoPage);
    fixture.detectChanges();
    const comp = fixture.componentInstance;
    expect(comp.form.valid).toBeFalse();
  });

  it('debe validar con datos correctos', () => {
    const fixture = TestBed.createComponent(ContactoPage);
    const comp = fixture.componentInstance;

    comp.form.setValue({
      nombre: 'Ana García',
      email: 'ana@example.com',
      motivo: 'duda',
      mensaje: 'Este es un mensaje de prueba con suficiente detalle.',
      aceptaPrivacidad: true
    });

    expect(comp.form.valid).toBeTrue();
  });

  it('debe mostrar errores al enviar con formulario inválido', () => {
    const fixture = TestBed.createComponent(ContactoPage);
    const comp = fixture.componentInstance;
    fixture.detectChanges();

    comp.onSubmit(); // invalid
    fixture.detectChanges();

    const errors = fixture.debugElement.queryAll(By.css('mat-error'));
    expect(errors.length).toBeGreaterThan(0);
  });
});
