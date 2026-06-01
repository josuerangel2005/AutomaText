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
  textoEditable: string = '';
  @ViewChild('editor') editorRef!: ElementRef<HTMLDivElement>;
  ignorarMayusculas: boolean = false;

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
  }

  alCambiarTexto(): void {
    this.actualizarTextoDesdeEditor();
  }

  resaltarTexto(): void {
    this.textoResaltado = this.resaltar.textoFinal(this.textoOriginal, this.resultados);
  }

  alternarModo(): void {
    this.modoVisual = !this.modoVisual;
  }

  actualizarTextoDesdeEditor(): void {
    const editor = this.editorRef?.nativeElement;
    if (!editor) return;

    this.textoEditable = editor.innerHTML;
    this.textoOriginal = editor.innerText;
    this.busqueda.setTexto(this.textoOriginal);
  }

  aplicarFormato(formato: 'bold' | 'italic' | 'underline'): void {
    if (this.modoVisual) return;

    document.execCommand(formato, false);
    this.actualizarTextoDesdeEditor();
  }

  aplicarAlineacion(formato: 'justifyLeft' | 'justifyCenter' | 'justifyRight'): void {
    if (this.modoVisual) return;
    document.execCommand(formato, false);
    this.actualizarTextoDesdeEditor();
  }

  aplicarLista(tipo: 'insertUnorderedList' | 'insertOrderedList'): void {
    if (this.modoVisual) return;
    document.execCommand(tipo, false);
    this.actualizarTextoDesdeEditor();
  }

  resaltarSeleccion(): void {
    if (this.modoVisual) return;
    document.execCommand('hiliteColor', false, '#fff59d');
    this.actualizarTextoDesdeEditor();
  }
}
