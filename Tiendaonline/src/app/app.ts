import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../components/header/header';

@Component({
  selector: 'app-root',
  standalone: true,                  // 👈 agregado
  imports: [RouterOutlet, Header],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']          // 👈 plural + array
})
export class App {
  protected readonly title = signal('Tiendaonline');
}
