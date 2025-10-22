import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../app/services/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export default class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(LoginService);
  private router = inject(Router);

  form = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(4)]],
  });

  onSubmit() {
    const { username, password } = this.form.value;
    if (!username || !password) return;

    const ok = this.auth.login(username, password);
    if (!ok) {
      alert('Usuario o contraseña incorrectos.');
      return;
    }
    this.router.navigateByUrl('/'); // volver al home (productos)
  }
}
