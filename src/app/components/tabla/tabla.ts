import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Busqueda } from '../../services/busqueda';
import { TablaTransciones } from '../../model/tabla.model';

@Component({
  selector: 'app-tabla',
  standalone: false,
  templateUrl: './tabla.html',
  styleUrl: './tabla.css',
})
export class Tabla implements OnInit {
  @Input() visible: boolean = false;
  @Output() cerrarModal = new EventEmitter<void>();

  tabla: TablaTransciones = {};
  estados: number[] = [];
  simbolos: string[] = [];

  constructor(private buscar: Busqueda) {}

  ngOnInit() {
    this.buscar.tablaEstados$.subscribe((tabla: TablaTransciones) => {
      this.tabla = tabla;
      this.actualizarEstructura();
    });
  }

  actualizarEstructura(): void {
    this.estados = Object.keys(this.tabla)
      .map(Number)
      .sort((a, b) => a - b);
    const simbolosSet = new Set<string>();
    for (const estado of this.estados) {
      Object.keys(this.tabla[estado]).forEach((s) => simbolosSet.add(s));
    }
    this.simbolos = Array.from(simbolosSet).sort();
  }

  cerrar(): void {
    this.cerrarModal.emit();
  }
}
