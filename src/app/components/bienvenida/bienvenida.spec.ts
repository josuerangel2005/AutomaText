import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bienvenida } from './bienvenida';

const CLAVE = 'automatext:inicio-visto';

const dirEspec = dirname(fileURLToPath(import.meta.url));
const ESTILOS_GLOBALES = readFileSync(join(dirEspec, '..', '..', '..', 'styles.css'), 'utf8');
const ESTILOS_MODAL = readFileSync(join(dirEspec, 'bienvenida.css'), 'utf8');
const PLANTILLA = readFileSync(join(dirEspec, 'bienvenida.html'), 'utf8');

describe('Bienvenida', () => {
  let fixture: ComponentFixture<Bienvenida>;
  let component: Bienvenida;
  let elemento: HTMLElement;
  let contenido: HTMLElement;

  beforeEach(() => {
    window.localStorage.clear();
    TestBed.configureTestingModule({
      declarations: [Bienvenida],
    });
    fixture = TestBed.createComponent(Bienvenida);
    component = fixture.componentInstance;
    elemento = fixture.nativeElement;
    document.body.appendChild(elemento);
    contenido = document.createElement('main');
    contenido.classList.add('content');
    document.body.appendChild(contenido);
    fixture.detectChanges();
  });

  afterEach(() => {
    elemento.remove();
    contenido.remove();
    window.localStorage.clear();
  });

  it('se muestra al abrir la app con título, texto explicativo y botón "Empezar"', () => {
    const modal = elemento.querySelector('.bienvenida-modal');
    expect(modal).not.toBeNull();

    const titulo = modal?.querySelector('h2');
    expect(titulo?.textContent).toContain('AutomaText');

    const texto = modal?.querySelector('p');
    expect(texto?.textContent).toContain('autómatas');

    const boton = modal?.querySelector('button');
    expect(boton?.textContent).toContain('Empezar');
  });

  it('se cierra al pulsar "Empezar"', () => {
    const boton = elemento.querySelector<HTMLButtonElement>('.bienvenida-modal button');
    boton?.click();
    fixture.detectChanges();

    expect(elemento.querySelector('.bienvenida-modal')).toBeNull();
  });

  it('se cierra al pulsar Escape', () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();

    expect(elemento.querySelector('.bienvenida-modal')).toBeNull();
  });

  it('se cierra al hacer clic fuera de la modal', () => {
    const fondo = elemento.querySelector<HTMLElement>('.bienvenida-fondo');
    fondo?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();

    expect(elemento.querySelector('.bienvenida-modal')).toBeNull();
  });

  it('no se cierra al hacer clic dentro de la modal', () => {
    const modal = elemento.querySelector<HTMLElement>('.bienvenida-modal');
    modal?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();

    expect(elemento.querySelector('.bienvenida-modal')).not.toBeNull();
  });

  it('el foco entra en la modal al abrirse y vuelve al contenido al cerrarse', () => {
    const boton = elemento.querySelector<HTMLButtonElement>('.bienvenida-modal button');
    expect(document.activeElement).toBe(boton);

    boton?.click();
    fixture.detectChanges();

    expect(document.activeElement).toBe(contenido);
  });

  it('en pantallas estrechas la modal usa un ancho fluido con margen, no uno fijo mayor que la ventana', () => {
    expect(ESTILOS_MODAL).toMatch(/position:\s*fixed/);
    expect(ESTILOS_MODAL).toMatch(/max-width:\s*min\(/);
    expect(ESTILOS_MODAL).toMatch(/100vw/);
    expect(ESTILOS_MODAL).not.toMatch(/[^-]width:\s*[5-9]\d{2,}px/);
  });

  it('reaparece tras cerrar la modal y recargar la página, aunque el navegador recuerde la sesión previa', () => {
    const boton = elemento.querySelector<HTMLButtonElement>('.bienvenida-modal button');
    boton?.click();
    fixture.detectChanges();
    expect(elemento.querySelector('.bienvenida-modal')).toBeNull();

    window.localStorage.setItem(CLAVE, '1');

    const recarga = TestBed.createComponent(Bienvenida);
    recarga.detectChanges();
    expect(recarga.nativeElement.querySelector('.bienvenida-modal')).not.toBeNull();
  });

  it('se muestra siempre, ignorando cualquier marca previa guardada en localStorage', () => {
    window.localStorage.setItem(CLAVE, '1');

    const nuevo = TestBed.createComponent(Bienvenida);
    nuevo.detectChanges();
    expect(nuevo.nativeElement.querySelector('.bienvenida-modal')).not.toBeNull();
  });

  it('los estilos globales definen variables compartidas de tipografía y color', () => {
    expect(ESTILOS_GLOBALES).toMatch(/:root\s*\{/);
    for (const variable of [
      '--fuente-base',
      '--color-primario',
      '--color-primario-hover',
      '--color-texto',
      '--color-texto-suave',
      '--fondo-suave',
      '--fondo-superficie',
      '--radio-boton',
      '--radio-panel',
      '--sombra-panel',
    ]) {
      expect(ESTILOS_GLOBALES).toContain(variable);
    }
  });

  it('la modal usa la misma fuente global que el resto de la app', () => {
    const fuenteGlobal = ESTILOS_GLOBALES.match(/--fuente-base:\s*([^;]+);/)?.[1]?.trim() ?? '';
    expect(fuenteGlobal).toContain('Inter');
    const fuenteApp = readFileSync(join(dirEspec, '..', '..', 'app.css'), 'utf8');
    const fuenteDeclarada = fuenteApp.match(/font-family:\s*([^;]+);/)?.[1]?.trim() ?? '';
    expect(new RegExp(fuenteDeclarada.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).test(fuenteGlobal))
      .toBe(true);
    expect(ESTILOS_MODAL).toMatch(/font-family:\s*var\(--fuente-base\)/);
    expect(ESTILOS_MODAL).not.toMatch(/font-family:[^;]*(Inter|Arial)/);
  });

  it('la modal usa las variables globales de color en fondo, título, texto y botón', () => {
    expect(ESTILOS_MODAL).not.toMatch(/#5b4dbd/);
    expect(ESTILOS_MODAL).toMatch(/var\(--color-primario\)/);
    expect(ESTILOS_MODAL).toMatch(/var\(--color-primario-hover\)/);
    expect(ESTILOS_MODAL).toMatch(/var\(--color-texto-suave\)/);
    expect(ESTILOS_MODAL).toMatch(/var\(--fondo-superficie\)/);
    expect(ESTILOS_MODAL).toMatch(/var\(--radio-panel\)/);
    expect(ESTILOS_MODAL).toMatch(/var\(--sombra-panel\)/);
  });

  it('la modal no declara animaciones ni transiciones automáticas', () => {
    const bloquesModal = ESTILOS_MODAL.match(/\.bienvenida[^{]*\{[^}]*\}/g) ?? [];
    expect(bloquesModal.length).toBeGreaterThan(0);
    for (const bloque of bloquesModal) {
      expect(bloque).not.toMatch(/animation|transition|@keyframes/);
    }
    expect(ESTILOS_MODAL).not.toMatch(/@keyframes/);
  });

  it('el contenido de la modal no muestra emojis', () => {
    const contenidoModal = fixture.nativeElement.textContent ?? '';
    expect(contenidoModal).not.toMatch(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{2B00}-\u{2BFF}]/u);
    expect(PLANTILLA).not.toMatch(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{2B00}-\u{2BFF}]/u);
  });
});
