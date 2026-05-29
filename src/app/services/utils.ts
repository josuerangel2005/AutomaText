import { Injectable } from '@angular/core';
import { RangoIndices } from './automata/automata.model';

@Injectable({
  providedIn: 'root',
})
export class Utils {
  subString(palabra: string, indiceInferior: number, indiceSuperior: number): string {
    let palabraSubString: string = '';

    for (let i: number = indiceInferior; i < indiceSuperior; i++) {
      palabraSubString += palabra[i];
    }

    return palabraSubString;
  }

  coincidencias(rangos: RangoIndices[], texto: string): string[] {
    let coincidencias: string[] = [];

    for (let rango of rangos) {
      coincidencias.push(this.subString(texto, rango.inicio - 5, rango.final + 5) + ' ...');
    }

    return coincidencias;
  }
}
