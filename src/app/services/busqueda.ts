import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Automata } from './automata/automata';
import { RangoIndices } from './automata/automata.model';

@Injectable({
  providedIn: 'root',
})
export class Busqueda {
  private textoSubject = new BehaviorSubject<string>('');
  private patronSubject = new BehaviorSubject<string>('');
  private resultadoSubject = new BehaviorSubject<RangoIndices[]>([]);
  private ignorarMayusculasSubject = new BehaviorSubject<boolean>(false);

  texto$ = this.textoSubject.asObservable();
  patron$ = this.patronSubject.asObservable();
  resultado$ = this.resultadoSubject.asObservable();
  ignorarMayusculas$ = this.ignorarMayusculasSubject.asObservable();

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

  getTexto(): string {
    return this.textoSubject.getValue();
  }

  getPatron(): string {
    return this.patronSubject.getValue();
  }

  getIgnorarMayusculas(): boolean {
    return this.ignorarMayusculasSubject.getValue();
  }

  buscar(): void {
    this.resultadoSubject.next(
      this.automata.kmp(
        this.ignorarMayusculasSubject.getValue()
          ? this.textoSubject.getValue().toLocaleLowerCase()
          : this.textoSubject.getValue(),
        this.ignorarMayusculasSubject.getValue()
          ? this.patronSubject.getValue().toLocaleLowerCase()
          : this.patronSubject.getValue(),
      ),
    );
  }
}
