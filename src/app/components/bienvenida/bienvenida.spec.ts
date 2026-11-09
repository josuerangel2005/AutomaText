import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bienvenida } from './bienvenida';

const CLAVE = 'automatext:inicio-visto';

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

  it('se muestra al primer arranque con título, texto explicativo y botón "Empezar"', () => {
    const modal = elemento.querySelector('.bienvenida-modal');
    expect(modal).not.toBeNull();

    const titulo = modal?.querySelector('h2');
    expect(titulo?.textContent).toContain('AutomaText');

    const texto = modal?.querySelector('p');
    expect(texto?.textContent).toContain('autómatas');

    const boton = modal?.querySelector('button');
    expect(boton?.textContent).toContain('Empezar');
  });

  it('no se muestra si la elección ya quedó registrada en localStorage', () => {
    window.localStorage.setItem(CLAVE, '1');
    const reabrir = TestBed.createComponent(Bienvenida);
    reabrir.detectChanges();
    expect(reabrir.nativeElement.querySelector('.bienvenida-modal')).toBeNull();
  });

  it('se cierra al pulsar "Empezar" y registra la elección', () => {
    const boton = elemento.querySelector<HTMLButtonElement>('.bienvenida-modal button');
    boton?.click();
    fixture.detectChanges();

    expect(elemento.querySelector('.bienvenida-modal')).toBeNull();
    expect(window.localStorage.getItem(CLAVE)).toBe('1');
  });

  it('se cierra al pulsar Escape y registra la elección', () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();

    expect(elemento.querySelector('.bienvenida-modal')).toBeNull();
    expect(window.localStorage.getItem(CLAVE)).toBe('1');
  });

  it('se cierra al hacer clic fuera de la modal y registra la elección', () => {
    const fondo = elemento.querySelector<HTMLElement>('.bienvenida-fondo');
    fondo?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();

    expect(elemento.querySelector('.bienvenida-modal')).toBeNull();
    expect(window.localStorage.getItem(CLAVE)).toBe('1');
  });

  it('no se cierra al hacer clic dentro de la modal', () => {
    const modal = elemento.querySelector<HTMLElement>('.bienvenida-modal');
    modal?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();

    expect(elemento.querySelector('.bienvenida-modal')).not.toBeNull();
    expect(window.localStorage.getItem(CLAVE)).toBeNull();
  });

  it('el foco entra en la modal al abrirse y vuelve al contenido al cerrarse', () => {
    const boton = elemento.querySelector<HTMLButtonElement>('.bienvenida-modal button');
    expect(document.activeElement).toBe(boton);

    boton?.click();
    fixture.detectChanges();

    expect(document.activeElement).toBe(contenido);
  });

  it('en pantallas estrechas la modal usa un ancho fluido con margen, no uno fijo mayor que la ventana', () => {
    const estilos = Array.from(document.head.querySelectorAll('style'))
      .map((s) => s.textContent ?? '')
      .join('\n');

    expect(estilos).toMatch(/position:\s*fixed/);
    expect(estilos).toMatch(/max-width:\s*min\(/);
    expect(estilos).toMatch(/100vw/);
    expect(estilos).not.toMatch(/[^-]width:\s*[5-9]\d{2,}px/);
  });
});
