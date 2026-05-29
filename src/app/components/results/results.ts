import { Component } from '@angular/core';
import { RangoIndices } from '../../services/automata/automata.model';
import { Busqueda } from '../../services/busqueda';
import { Utils } from '../../services/utils';

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

  resultados: RangoIndices[] = [];

  ngOnInit(): void {
    this.busqueda.resultado$.subscribe((val: RangoIndices[]) => {
      this.resultados = val;
    });
  }

  constructor(
    private busqueda: Busqueda,
    private utils: Utils,
  ) {}
}
