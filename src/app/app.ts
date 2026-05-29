import { Component, signal } from '@angular/core';
import { Automata } from './services/automata/automata';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('automa-text');

  constructor(private automata: Automata) {}
}
