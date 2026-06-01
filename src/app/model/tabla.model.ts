import { TransicionesEstado } from './estado.model';

export interface TablaTransciones {
  [idEstado: number]: TransicionesEstado;
}
