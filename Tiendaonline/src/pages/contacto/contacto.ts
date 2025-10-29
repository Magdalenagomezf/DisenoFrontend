import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { debounceTime } from 'rxjs/operators';

/** Validador sencillo para evitar mensajes vacíos con solo espacios o repetición de caracteres */
function nonTrivialText(control: AbstractControl): ValidationErrors | null {
  const v = (control.value || '').trim();
  if (!v) return { emptyText: true };
  if (/^([a-zA-ZñÑáéíóúÁÉÍÓÚ0-9])\1{9,}$/.test(v)) return { repeatedChars: true }; // ej: "aaaaaaaaaa"
  return null;
}

/** Validador de email profesional (dominios comunes + estructura RFC sencilla) */
const emailRegex =
  /^[a-zA-Z0-9._%+\-']+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

@Component({
  selector: 'app-contacto-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './contacto.html',
  styleUrls: ['./contacto.scss']
})
export default class ContactoPage {
  private fb = inject(FormBuilder);
  private snackbar = inject(MatSnackBar);

  loading = signal(false);
  submitted = signal(false);

  motivos = [
    { value: 'duda', label: 'Duda general' },
    { value: 'pago', label: 'Problema con el pago' },
    { value: 'envio', label: 'Estado/Problema de envío' },
    { value: 'devolucion', label: 'Devolución o cambio' },
    { value: 'otro', label: 'Otro' }
  ];

  form = this.fb.group({
    nombre: this.fb.control('', {
      validators: [Validators.required, Validators.minLength(3)],
      nonNullable: true
    }),
    email: this.fb.control('', {
      validators: [Validators.required, Validators.pattern(emailRegex)],
      nonNullable: true
    }),
    motivo: this.fb.control<string | null>(null, { validators: [Validators.required] }),
    mensaje: this.fb.control('', {
      validators: [Validators.required, Validators.minLength(20), Validators.maxLength(800), nonTrivialText],
      nonNullable: true
    }),
    aceptaPrivacidad: this.fb.control(false, { validators: [Validators.requiredTrue], nonNullable: true })
  });

  // UX: contador de caracteres del mensaje
  mensajeLen = computed(() => this.form.controls.mensaje.value.length);

  // Marcar errores “al escribir”
  constructor() {
    const sub = this.form.valueChanges.pipe(debounceTime(150)).subscribe(() => {
      if (this.submitted()) {
        Object.values(this.form.controls).forEach(c => c.updateValueAndValidity({ onlySelf: true }));
      }
    });
    // Limpieza cuando el componente muere (Angular destruye subs con takeUntilDestroy en v17+, aquí sencillo)
    effect(onCleanup => onCleanup(() => sub.unsubscribe()));
  }

  async onSubmit() {
    this.submitted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.snackbar.open('Revisá los campos marcados en rojo.', 'Aceptar', { duration: 3000 });
      return;
    }

    try {
      this.loading.set(true);
      // Simulación de envío a API
      await new Promise(res => setTimeout(res, 900));

      this.snackbar.open('¡Gracias! Recibimos tu mensaje y te contactaremos pronto.', 'Cerrar', { duration: 3500 });
      this.form.reset({
        nombre: '',
        email: '',
        motivo: null,
        mensaje: '',
        aceptaPrivacidad: false
      });
      this.submitted.set(false);
    } catch {
      this.snackbar.open('No pudimos enviar el formulario. Probá nuevamente.', 'Cerrar', { duration: 3500 });
    } finally {
      this.loading.set(false);
    }
  }

  // Helpers para el template
  showError(control: AbstractControl | null, error: string): boolean {
    if (!control) return false;
    return (control.touched || this.submitted()) && !!control.errors?.[error];
  }
}
