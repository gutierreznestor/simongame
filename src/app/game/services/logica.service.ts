import { Injectable } from '@angular/core';

import { START_CONTADOR, PALABRAS_EN, CANT_BOTONES } from '../constants/constants';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LogicaService {
  
  simon: string[] = [];
  jugador: string[] = [];
  palabrasAlAzar: string[] = [];
  contador: number;
  state = new Subject<any>();
  
  constructor() {
    this.contador = START_CONTADOR;
  }
  
  async generarSimon(): Promise<string[]> {
    
    this.palabrasAlAzar = await this.seleccionarPalabrasAlAzar( PALABRAS_EN, CANT_BOTONES );
    let nuevoSimon: string[] = [];
    for (let i = 0; i < this.contador; i++) {
      let incrementarContador = false;
      nuevoSimon.push(await this.agregarSimon(incrementarContador, this.palabrasAlAzar));
    }
    this.simon = nuevoSimon;
    this.setState();
    return nuevoSimon;
  }
  
  private seleccionarPalabrasAlAzar( arregloPalabras: string[], cantPalabras: number ): Promise<string[]> {
    let promesa = new Promise<string[]>((resolve, reject) => {
      let cuatroPalabras: string[] = [];
      for (let i = 0; i < cantPalabras; i++) {
        let random = Math.floor(Math.random() * this.contador);
        cuatroPalabras.push(arregloPalabras.splice(random, 1)[0]);
      }
      resolve(cuatroPalabras);
    });
    return promesa;
  } 
  
  async agregarSimon( incrementar: boolean = false, cuatroPalabrasAlAzar: string[] ): Promise<string> {
    if ( incrementar ) {
      this.contador++;
    }
    return await this.palabraRandom(cuatroPalabrasAlAzar);
  }
  
  palabraRandom( cuatroPalabrasAlAzar: string[] ): string {
    return cuatroPalabrasAlAzar[Math.floor(Math.random() * CANT_BOTONES)];
  }
  
  resetearSimon(): Promise<string[]> {
    this.contador = START_CONTADOR;
    return this.generarSimon();
  }
  
  async acertar( val: string ): Promise<boolean> {
    
    this.jugador.push(val);
    let adivino = await this.compararConSimon();
    if( adivino ) {
      if( this.jugador.length == this.contador ) {
        let incrementarContador = true;
        this.simon.push(await this.agregarSimon(incrementarContador, this.palabrasAlAzar));
        this.jugador = [];
      }
    } else {
      this.jugador = [];
      this.contador = START_CONTADOR;
    }
    this.setState();
    return adivino;
  }
  
  async compararConSimon(): Promise<boolean> {
    for (let index = 0; index < this.jugador.length; index++) {
      const element = this.jugador[index];
      if( element !== this.simon[index] ) {
        return false;
      }
    }    
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
