import { Component } from '@angular/core';
import { Busqueda } from '../../services/busqueda';

@Component({
  selector: 'app-search',
  standalone: false,
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search {
  patron: string = '';

  constructor(private busqueda: Busqueda) {}

  alCambiarPatron() {
    this.busqueda.setPatron(this.patron);
  }

  buscar() {
    this.alCambiarPatron();
    this.busqueda.buscar();
  }
}
