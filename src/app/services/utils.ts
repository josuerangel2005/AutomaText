import { Injectable } from '@angular/core';
import { RangoIndices } from './automata/automata.model';
import { Resultados } from './resultados.model';

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

  coincidencias(rango: RangoIndices, texto: string): string {
    const inicio: number = 0 > rango.inicio - 5 ? 0 : rango.inicio - 5;
    const final: number = texto.length < rango.final + 5 ? texto.length : rango.final + 5;

    const antes: string = this.subString(texto, inicio, rango.inicio);
    const match: string = this.subString(texto, rango.inicio, rango.final + 1);
    const despues: string = this.subString(texto, rango.final + 1, final);

    return `${antes}<span class="remarcado">${match}</span>${despues} ...`;
  }

  lineas(texto: string): string[] {
    let lineas: string[] = [];
    let linea: string = '';

    for (let caracter of texto) {
      if (caracter === '\n') {
        lineas.push(linea);
        linea = '';
        continue;
      }

      linea += caracter;
    }

    lineas.push(linea);

    return lineas;
  }

  obtenerLineaYPosicion(texto: string, indiceInicio: number): { linea: number; posicion: number } {
    const textoAntes: string = this.subString(texto, 0, indiceInicio);
    const linea: number = this.lineas(textoAntes).length;
    const ultimaLinea: string = this.lineas(textoAntes)[linea - 1];
    const posicion: number = ultimaLinea.length + 1;

    return { linea, posicion };
  }

  resultados(rangos: RangoIndices[], texto: string): Resultados[] {
    let resultados: Resultados[] = [];
    let numeroCoincidencia: number = 1;

    for (let rango of rangos) {
      const lineaYPoscion = this.obtenerLineaYPosicion(texto, rango.inicio);
      resultados.push({
        titulo: 'Coincidencia ' + numeroCoincidencia,
        linea: lineaYPoscion.linea,
        posicion: lineaYPoscion.posicion,
        snippet: this.coincidencias(rango, texto),
      });
      numeroCoincidencia++;
    }

    return resultados;
  }
}
