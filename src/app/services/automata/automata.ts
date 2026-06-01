import { Injectable } from '@angular/core';
import { RangoIndices } from '../../model/automata.model';
import { Utils } from '../utils';
import { TablaTransciones } from '../../model/tabla.model';

@Injectable({
  providedIn: 'root',
})
export class Automata {
  constructor(private utils: Utils) {}

  siguienteEstado(patron: string, estado: number, simbolo: string): number {
    const m: number = patron.length;
    const prefijo: string = this.utils.subString(patron, 0, estado) + simbolo;

    for (
      let nuevoEstado: number = m < estado + 1 ? m : estado + 1;
      nuevoEstado > 0;
      nuevoEstado--
    ) {
      if (this.utils.finalizaEn(prefijo, this.utils.subString(patron, 0, nuevoEstado)))
        return nuevoEstado;
    }

    return 0;
  }

  construirAutomata(patron: string): { delta: TablaTransciones; estadoFinal: number } {
    const delta: TablaTransciones = {};
    const m: number = patron.length;

    const alfabeto: string[] = this.utils.eliminarRepetidos(this.utils.separar(patron, ''));

    for (let estado = 0; estado <= m; estado++) {
      delta[estado] = {};

      for (const simbolo of alfabeto) {
        delta[estado][simbolo] = this.siguienteEstado(patron, estado, simbolo);
      }
    }

    return { delta, estadoFinal: m };
  }

  buscarConAutomata(texto: string, patron: string): RangoIndices[] {
    if (!patron) return [];

    const rangos: RangoIndices[] = [];
    let estado: number = 0;
    const { delta, estadoFinal } = this.construirAutomata(patron);

    for (let i: number = 0; i < texto.length; i++) {
      const simbolo: string = texto[i];

      if (delta[estado] && delta[estado][simbolo] !== undefined) {
        estado = delta[estado][simbolo];
      } else {
        estado = 0;
      }

      if (estado === estadoFinal) {
        rangos.push({ inicio: i - patron.length + 1, final: i });
      }
    }

    return rangos;
  }
}
