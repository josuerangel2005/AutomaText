import { Component, OnInit } from '@angular/core';
import { Busqueda } from '../../services/busqueda';
import { RangoIndices } from '../../services/automata/automata.model';

@Component({
  selector: 'app-editor',
  standalone: false,
  templateUrl: './editor.html',
  styleUrl: './editor.css',
})
export class Editor implements OnInit {
  resultados: RangoIndices[] = [];
  texto: string = '';

  ngOnInit(): void {
    this.busqueda.resultado$.subscribe((val: RangoIndices[]) => {
      this.resultados = val;
    });
  }

  constructor(private busqueda: Busqueda) {}

  alCambiarTexto(): void {
    this.busqueda.setTexto(this.texto);
  }
}
