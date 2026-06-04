import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Busqueda } from '../../services/busqueda';
import { RangoIndices } from '../../model/automata.model';
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
  zoomLevel: number = 100;
  mostrarTabla: boolean = false;

  readonly ZOOM_MIN = 50;
  readonly ZOOM_MAX = 170;
  readonly ZOOM_STEP = 10;

  @ViewChild('editor') editorRef!: ElementRef<HTMLTextAreaElement>;

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

    this.busqueda.indiceSeleccionado$.subscribe((indice: number) => {
      if (indice < 0) return;
      this.modoVisual = true;
      setTimeout(() => {
        const spans = document.querySelectorAll('.texto-resaltado .remarcado');
        spans.forEach((s) => s.classList.remove('remarcado-activo'));
        if (spans[indice]) {
          spans[indice].classList.add('remarcado-activo');
          spans[indice].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    });
  }

  alCambiarTexto(): void {
    this.actualizarTextoDesdeEditor();
  }

  resaltarTexto(): void {
    this.textoResaltado = this.resaltar.textoFinal(this.textoOriginal, this.resultados);
  }

  actualizarTextoDesdeEditor(): void {
    const editor = this.editorRef?.nativeElement;
    if (!editor) return;
    this.textoOriginal = editor.value;
    this.busqueda.setTexto(this.textoOriginal);
  }

  aumentarFuente(): void {
    if (this.zoomLevel < this.ZOOM_MAX) {
      this.zoomLevel = Math.min(this.zoomLevel + this.ZOOM_STEP, this.ZOOM_MAX);
    }
  }

  disminuirFuente(): void {
    if (this.zoomLevel > this.ZOOM_MIN) {
      this.zoomLevel = Math.max(this.zoomLevel - this.ZOOM_STEP, this.ZOOM_MIN);
    }
  }

  limpiar(): void {
    const editor = this.editorRef?.nativeElement;
    if (editor) editor.value = '';
    this.textoOriginal = '';
    this.textoResaltado = '';
    this.resultados = [];
    this.modoVisual = false;
    this.busqueda.setTexto('');
  }

  get fontSize(): string {
    return `${(this.zoomLevel / 100) * 16}px`;
  }
}
