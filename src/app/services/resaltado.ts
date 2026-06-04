import { Injectable } from '@angular/core';
import { Utils } from './utils';
import { RangoIndices } from '../model/automata.model';

@Injectable({
  providedIn: 'root',
})
export class Resaltado {
  constructor(private utils: Utils) {}

  private escapar(texto: string): string {
    return texto.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  aRemarcar(texto: string, indices: RangoIndices[]): string[] {
    let remarcadas: string[] = [];

    for (let rango of indices) {
      remarcadas.push(this.utils.subString(texto, rango.inicio, rango.final + 1));
    }

    return remarcadas;
  }

  textoNormal(texto: string, indices: RangoIndices[]): string[] {
    let textoNormal: string[] = [];
    let cursor: number = 0;
    for (let rango of indices) {
      const fragmento: string = this.utils.subString(texto, cursor, rango.inicio);
      textoNormal.push(this.escapar(fragmento));
      cursor = rango.final + 1;
    }
    textoNormal.push(this.escapar(this.utils.subString(texto, cursor, texto.length)));
    return textoNormal;
  }
  remarcarCoincidencias(texto: string, indices: RangoIndices[]): string[] {
    let remarcadas: string[] = [];
    for (let palabra of this.aRemarcar(texto, indices)) {
      remarcadas.push('<span class="remarcado">' + this.escapar(palabra) + '</span>');
    }
    return remarcadas;
  }

  textoFinal(texto: string, indices: RangoIndices[]): string {
    const textoNormal: string[] = this.textoNormal(texto, indices);
    const textoRemarcado: string[] = this.remarcarCoincidencias(texto, indices);
    let textoFinal: string = '';
    let i: number = 0;

    for (
      i;
      i < (textoNormal.length < textoRemarcado.length ? textoNormal.length : textoRemarcado.length);
      i++
    ) {
      textoFinal += textoNormal[i] + textoRemarcado[i];
    }

    if (i < textoNormal.length) textoFinal += textoNormal[i];
    if (i < textoRemarcado.length) textoFinal += textoRemarcado[i];

    return textoFinal;
  }
}
