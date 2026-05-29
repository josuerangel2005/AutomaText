import { Component } from '@angular/core';

@Component({
  selector: 'app-results',
  standalone: false,
  templateUrl: './results.html',
  styleUrl: './results.css',
})
export class Results {
  title: string = 'Hola';
  meta: string = 'Hola';
  snippet: string = 'Hola';
}
