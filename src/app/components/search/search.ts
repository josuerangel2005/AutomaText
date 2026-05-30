import { Component, OnInit } from '@angular/core';
import { Busqueda } from '../../services/busqueda';
import { Utils } from '../../services/utils';
import { RangoIndices } from '../../services/automata/automata.model';
import { Resultados } from '../../services/resultados.model';

@Component({
  selector: 'app-search',
  standalone: false,
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search implements OnInit {
  patron: string = '';
  resultados: Resultados[] = [];
  rangos: RangoIndices[] = [];
  totalCoincidencias: number = 0;
  ignorarMayusculas: boolean = false;

  ngOnInit(): void {
    this.busqueda.resultado$.subscribe((val: RangoIndices[]) => {
      this.rangos = val;
      this.resultados = this.utils.resultados(this.rangos, this.busqueda.getTexto());
      this.totalCoincidencias = this.rangos.length;
    });
  }

  constructor(
    private busqueda: Busqueda,
    private utils: Utils,
  ) {}

  alCambiarPatron() {
    this.busqueda.setPatron(this.patron);
  }

  buscar() {
    this.alCambiarPatron();
    this.busqueda.setIgnorarMayusculas(this.ignorarMayusculas);
    this.busqueda.buscar();
  }
}
