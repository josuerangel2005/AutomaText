import { Component, Input } from '@angular/core';
import { RangoIndices } from '../../services/automata/automata.model';
import { Busqueda } from '../../services/busqueda';

@Component({
  selector: 'app-results',
  standalone: false,
  templateUrl: './results.html',
  styleUrl: './results.css',
})
export class Results {
  @Input() title: string = '';
  @Input() meta: string = '';
  @Input() snippet: string = '';

  resultados: RangoIndices[] = [];

  ngOnInit(): void {
    this.busqueda.resultado$.subscribe((val: RangoIndices[]) => {
      this.resultados = val;
    });
  }

  constructor(private busqueda: Busqueda) {}
}
