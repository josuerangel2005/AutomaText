import { Injectable } from '@angular/core';
import { Utils } from '../utils';
import { RangoIndices } from '../../model/automata.model';

@Injectable({
  providedIn: 'root',
})
export class Kmp {
  constructor(private utils: Utils) {}

  getPrefijos(patron: string): string[] {
    let prefijos: string[] = [];
    let i: number = 0;

    while (i < patron.length - 1) {
      prefijos.push(this.utils.subString(patron, 0, i + 1));
      i++;
    }

    return prefijos;
  }

  getSufijos(patron: string): string[] {
    let sufijos: string[] = [];
    let i: number = patron.length - 1;

    while (i > 0) {
      sufijos.push(this.utils.subString(patron, i, patron.length));
      i--;
    }
    return sufijos;
  }

  getIguales(prefijos: string[], sufijos: string[]): string[] {
    let iguales: string[] = [];

    for (let i: number = 0; i < prefijos.length; i++) {
      if (prefijos[i] === sufijos[i]) {
        iguales.push(prefijos[i]);
      }
    }

    return iguales;
  }

  getMayorLongitud(palabras: string[]): number {
    if (!palabras || palabras.length === 0) return 0;

    let mayorTamanio: number = 0;

    for (let palabra of palabras) {
      if (palabra.length > mayorTamanio) mayorTamanio = palabra.length;
    }

    return mayorTamanio;
  }

  tablaPi(patron: string): number[] {
    let tabla: number[] = [];

    for (let i: number = 0; i < patron.length; i++) {
      tabla.push(
        this.getMayorLongitud(
          this.getIguales(
            this.getPrefijos(this.utils.subString(patron, 0, i + 1)),

            this.getSufijos(this.utils.subString(patron, 0, i + 1)),
          ),
        ),
      );
    }

    return tabla;
  }

  kmp(texto: string, patron: string): RangoIndices[] {
    let rangos: RangoIndices[] = [];
    let i: number = 0;
    let j: number = 0;
    let tabla: number[] = this.tablaPi(patron);

    while (i < texto.length) {
      if (texto[i] === patron[j]) {
        i++;
        j++;
        if (j == patron.length) {
          rangos.push({ inicio: i - j, final: i - 1 });
          j = tabla[j - 1];
        }
      } else {
        if (j == 0) {
          i++;
        } else {
          j = tabla[j - 1];
        }
      }
    }

    return rangos;
  }
}
