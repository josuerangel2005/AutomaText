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

  texto$ = this.textoSubject.asObservable();
  patron$ = this.patronSubject.asObservable();
  resultado$ = this.resultadoSubject.asObservable();

  constructor(private automata: Automata) {}

  setTexto(texto: string): void {
    this.textoSubject.next(texto);
  }

  setPatron(patron: string): void {
    this.patronSubject.next(patron);
  }

  getTexto(): string {
    return this.textoSubject.getValue();
  }

  getPatron(): string {
    return this.patronSubject.getValue();
  }

  buscar(): void {
    this.resultadoSubject.next(
      this.automata.kmp(this.textoSubject.getValue(), this.patronSubject.getValue()),
    );
  }
}
