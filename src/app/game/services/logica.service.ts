import { Injectable } from '@angular/core';

import { START_CONTADOR, PALABRAS_EN, PALABRAS_ES } from '../constants/constants';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LogicaService {
  
  simon: string[] = [];
  jugador: string[] = [];
  cuatroPalabrasAlAzar: string[] = [];
  contador: number;
  state = new Subject<any>();
  
  constructor() {
    this.contador = START_CONTADOR;
  }
  
  async generarSimon(): Promise<string[]> {
    
    this.cuatroPalabrasAlAzar = await this.seleccionarCuatroPalabras( PALABRAS_EN );
    for (let i = 0; i < this.contador; i++) {
      this.agregarSimon(false);
    }
    this.setState();
    return this.simon;
  }
  
  private seleccionarCuatroPalabras( arregloPalabras: string[] ): Promise<string[]> {
    let promesa = new Promise<string[]>((resolve, reject) => {
      let cuatroPalabras: string[] = [];
      for (let i = 0; i < 4; i++) {
        let random = Math.floor(Math.random() * arregloPalabras.length)
        cuatroPalabras.push(arregloPalabras.splice(random, 1)[0] )
      }
      resolve(cuatroPalabras);
    });
    return promesa;
  } 
  
  agregarSimon( incrementar: boolean = false ): void {
    if (incrementar) {
      this.contador++;
    }
    this.simon.push(this.palabraRandom());
  }
  
  palabraRandom(): string {
    return this.cuatroPalabrasAlAzar[Math.floor(Math.random() * 4)];
  }
  
  async resetearSimon(): Promise<string[]> {
    this.contador = START_CONTADOR;
    return this.generarSimon();
  }
  
  adivinar( val: string ) {
    
    this.jugador.push(val);
    if( !this.compararConSimon() ) {
      this.jugador = [];
    }
    this.setState();
  }
  
  compararConSimon(): boolean {
    
    return true;
  }
  
  setState() {
    this.state.next({
      jugador: this.jugador,
      simon: this.simon,
      contador: this.contador
    });
  }
}
