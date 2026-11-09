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

function estilosTotales(): string {
  return Array.from(document.head.querySelectorAll('style'))
    .map((s) => s.textContent ?? '')
    .join('\n');
}

function patronSelector(selector: string): string {
  const alcance = '(?:\\[[_a-z][^\\]]*\\])*';
  return (
    selector
      .split(':')
      .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + alcance)
      .join(':') + '\\s*\\{'
  );
}

function bloque(selector: string): string {
  return estilosTotales().match(new RegExp(patronSelector(selector) + '([^}]*)\\}'))?.[1] ?? '';
}

function propiedad(bloqueCss: string, propiedadCss: string): string {
  const regexp = new RegExp(`(?:^|[;\\s])${propiedadCss}\\s*:\\s*([^;]+);?$`, 'm');
  return bloqueCss.match(regexp)?.[1]?.trim() ?? '';
}

describe('Bienvenida (S1: estilo coherente con el resto de la app)', () => {
  let fixture: ComponentFixture<Bienvenida>;

  beforeEach(() => {
    window.localStorage.clear();
    TestBed.configureTestingModule({ declarations: [Bienvenida] });
    fixture = TestBed.createComponent(Bienvenida);
    fixture.detectChanges();
  });

  it('usa la misma familia tipográfica que la app (Inter con fallbacks del sistema)', () => {
    const fuente = propiedad(bloque('.bienvenida-modal'), 'font-family');
    expect(fuente).toContain('Inter');
    expect(fuente).toContain('system-ui');
    expect(fuente).not.toContain('Arial');
  });

  it('el color base del texto coincide con el de los paneles de la app (#1c1c1e)', () => {
    expect(propiedad(bloque('.bienvenida-modal'), 'color')).toBe('#1c1c1e');
  });

  it('el título usa el estilo de los títulos de panel: 22px, peso 500 y color #1c1c1e', () => {
    const titulo = bloque('.bienvenida-titulo');
    expect(propiedad(titulo, 'font-size')).toBe('22px');
    expect(propiedad(titulo, 'font-weight')).toBe('500');
    expect(propiedad(titulo, 'color')).toBe('#1c1c1e');
  });

  it('el texto descriptivo usa el gris secundario de la app (#636366)', () => {
    expect(propiedad(bloque('.bienvenida-texto'), 'color')).toBe('#636366');
  });

  it('el botón "Empezar" es el mismo botón primario de la app (#5b4dbd, radio 14px, 46px de alto, peso 500)', () => {
    const boton = bloque('.bienvenida-empezar');
    expect(propiedad(boton, 'background')).toBe('#5b4dbd');
    expect(propiedad(boton, 'color')).toBe('#ffffff');
    expect(propiedad(boton, 'border-radius')).toBe('14px');
    expect(propiedad(boton, 'height')).toBe('46px');
    expect(propiedad(boton, 'font-size')).toBe('15px');
    expect(propiedad(boton, 'font-weight')).toBe('500');
  });

  it('el hover del botón usa el mismo color que los botones primarios de la app (#4c3bcc)', () => {
    const hover = estilosTotales().match(
      new RegExp(patronSelector('.bienvenida-empezar:hover') + '([^}]*)\\}'),
    );
    expect(propiedad(hover?.[1] ?? '', 'background')).toBe('#4c3bcc');
  });

  it('el contenedor es como los paneles de la app: blanco, borde #d3d3df y radio 24px', () => {
    const modal = bloque('.bienvenida-modal');
    expect(propiedad(modal, 'background')).toBe('#ffffff');
    expect(propiedad(modal, 'border')).toContain('#d3d3df');
    expect(propiedad(modal, 'border-radius')).toBe('24px');
  });
});

describe('Bienvenida (S2: sin animaciones forzadas ni emojis)', () => {
  let fixture: ComponentFixture<Bienvenida>;
  let elemento: HTMLElement;

  beforeEach(() => {
    window.localStorage.clear();
    TestBed.configureTestingModule({ declarations: [Bienvenida] });
    fixture = TestBed.createComponent(Bienvenida);
    elemento = fixture.nativeElement;
    document.body.appendChild(elemento);
    fixture.detectChanges();
  });

  afterEach(() => {
    elemento.remove();
    window.localStorage.clear();
  });

  it('los estilos de la modal no definen animaciones ni keyframes', () => {
    const estilos = estilosTotales();
    expect(estilos).not.toMatch(/@keyframes/);
    expect(estilos).not.toMatch(/[^-]animation\s*:/);
  });

  it('los estilos de la modal no aplican transiciones que retrasen su aparición', () => {
    const fondo = bloque('.bienvenida-fondo');
    const modal = bloque('.bienvenida-modal');
    expect(propiedad(fondo, 'transition')).toBe('');
    expect(propiedad(modal, 'transition')).toBe('');

    const fondoConTruco = fondo.match(/opacity|transform|visibility|filter|scale/g) ?? [];
    expect(fondoConTruco).toEqual([]);
  });

  it('la modal aparece de inmediato, sin esperar ciclos ni animaciones', () => {
    expect(elemento.querySelector('.bienvenida-modal')).not.toBeNull();
  });

  it('ningún texto de la modal contiene emojis', () => {
    const texto = elemento.querySelector('.bienvenida-modal')?.textContent ?? '';
    const emoji = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}]/u;
    expect(emoji.test(texto)).toBe(false);
  });
});
