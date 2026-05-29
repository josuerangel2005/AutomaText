import { Component, OnInit } from '@angular/core';
import { Busqueda } from '../../services/busqueda';
import { RangoIndices } from '../../services/automata/automata.model';
import { Resaltado } from '../../services/resaltado';

@Component({
  selector: 'app-editor',
  standalone: false,
  templateUrl: './editor.html',
  styleUrl: './editor.css',
})
export class Editor implements OnInit {
  resultados: RangoIndices[] = [];
  textoOriginal: string = '';
  textoResaltado: string = '';
  modoVisual: boolean = false;

  constructor(
    private busqueda: Busqueda,
    private resaltar: Resaltado,
  ) {}

  ngOnInit(): void {
    this.busqueda.resultado$.subscribe((val: RangoIndices[]) => {
      this.resultados = val;
      this.resaltarTexto();
      if (val.length > 0) {
        this.modoVisual = true;
      }
    });
  }

  alCambiarTexto(): void {
    this.busqueda.setTexto(this.textoOriginal);
  }

  resaltarTexto(): void {
    this.textoResaltado = this.resaltar.textoFinal(this.textoOriginal, this.resultados);
  }

  alternarModo(): void {
    this.modoVisual = !this.modoVisual;
  }
}
