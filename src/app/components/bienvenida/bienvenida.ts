import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-bienvenida',
  standalone: false,
  templateUrl: './bienvenida.html',
  styleUrl: './bienvenida.css',
})
export class Bienvenida {
  static readonly CLAVE_VISTA = 'automatext:inicio-visto';

  @ViewChild('fondo') fondoRef?: ElementRef<HTMLElement>;
  @ViewChild('empezar') empezarRef?: ElementRef<HTMLButtonElement>;

  visible: boolean = true;

  ngOnInit(): void {
    this.visible = true;
  }

  ngAfterViewInit(): void {
    if (this.visible) {
      this.empezarRef?.nativeElement.focus();
    }
  }

  @HostListener('document:keydown.escape')
  alPulsarEscape(): void {
    this.cerrar();
  }

  alHacerClicFondo(event: MouseEvent): void {
    if (event.target === this.fondoRef?.nativeElement) {
      this.cerrar();
    }
  }

  cerrar(): void {
    if (!this.visible) return;
    this.visible = false;
    window.localStorage.removeItem(Bienvenida.CLAVE_VISTA);
    this.devolverFoco();
  }

  private devolverFoco(): void {
    const contenido = document.querySelector<HTMLElement>('main.content');
    if (!contenido) return;
    contenido.tabIndex = -1;
    contenido.focus();
  }
}
