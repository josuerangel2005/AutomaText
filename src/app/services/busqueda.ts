import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Automata } from './automata/automata';
import { RangoIndices } from '../model/automata.model';
import { TablaTransciones } from '../model/tabla.model';

@Injectable({
  providedIn: 'root',
})
export class Busqueda {
  private textoSubject = new BehaviorSubject<string>('');
  private patronSubject = new BehaviorSubject<string>('');
  private resultadoSubject = new BehaviorSubject<RangoIndices[]>([]);
  private ignorarMayusculasSubject = new BehaviorSubject<boolean>(false);
  private ignorarEspaciosEnBlancoSubject = new BehaviorSubject<boolean>(false);
  private tablaEstados = new BehaviorSubject<TablaTransciones>({});
  private indiceSeleccionadoSubject = new BehaviorSubject<number>(-1);

  texto$ = this.textoSubject.asObservable();
  patron$ = this.patronSubject.asObservable();
  resultado$ = this.resultadoSubject.asObservable();
  ignorarMayusculas$ = this.ignorarMayusculasSubject.asObservable();
  ignorarEspaciosEnBlanco$ = this.ignorarEspaciosEnBlancoSubject.asObservable();
  tablaEstados$ = this.tablaEstados.asObservable();
  indiceSeleccionado$ = this.indiceSeleccionadoSubject.asObservable();

  constructor(private automata: Automata) {}

  setTexto(texto: string): void {
    this.textoSubject.next(texto);
  }

  setPatron(patron: string): void {
    this.patronSubject.next(patron);
  }

  setIgnorarMayusculas(ignorar: boolean): void {
    this.ignorarMayusculasSubject.next(ignorar);
  }

  setIgnorarEspaciosEnBlanco(ignorar: boolean): void {
    this.ignorarEspaciosEnBlancoSubject.next(ignorar);
  }

  setTablaEstados(tabla: TablaTransciones): void {
    this.tablaEstados.next(tabla);
  }

  setIndiceSeleccionado(indice: number): void {
    this.indiceSeleccionadoSubject.next(indice);
  }

  getTexto(): string {
    return this.textoSubject.getValue();
  }

  getPatron(): string {
    return this.patronSubject.getValue();
  }

  getIgnorarMayusculas(): boolean {
    return this.ignorarMayusculasSubject.getValue();
  }

  getIgnorarEspaciosEnBlanco(): boolean {
    return this.ignorarEspaciosEnBlancoSubject.getValue();
  }

  getTablaEstados(): TablaTransciones {
    return this.tablaEstados.getValue();
  }

  buscar(): void {
    let texto: string = this.ignorarMayusculasSubject.getValue()
      ? this.textoSubject.getValue().toLocaleLowerCase()
      : this.textoSubject.getValue();

    let patron: string = this.ignorarMayusculasSubject.getValue()
      ? this.patronSubject.getValue().toLocaleLowerCase()
      : this.patronSubject.getValue();

    if (this.ignorarEspaciosEnBlancoSubject.getValue()) {
      texto = texto.trim();
      patron = patron.trim();
    }

    this.resultadoSubject.next(this.automata.buscarConAutomata(texto, patron));
    const { delta } = this.automata.construirAutomata(patron);
    this.tablaEstados.next(delta);
  }
}
