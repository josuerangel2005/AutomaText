import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { App } from './app';
import { Editor } from './components/editor/editor';
import { Search } from './components/search/search';
import { Results } from './components/results/results';
import { Tabla } from './components/tabla/tabla';
import { Bienvenida } from './components/bienvenida/bienvenida';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([]), FormsModule],
      declarations: [App, Editor, Search, Results, Tabla, Bienvenida],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain(
      'Hello, automa-text',
    );
  });

  it('should keep a single h1 in the topbar with brand icon and subtitle intact', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const topbar = compiled.querySelector('.topbar');
    expect(topbar).toBeTruthy();
    const headings = topbar!.querySelectorAll('h1');
    expect(headings.length).toBe(1);
    expect(topbar!.querySelector('.brand-icon')?.textContent).toContain('A');
    expect(topbar!.querySelector('.brand-text p')?.textContent).toContain(
      'Reconocedor de patrones en texto',
    );
  });
});
