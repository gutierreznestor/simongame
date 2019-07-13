import { Injectable } from '@angular/core';

import { START_CONTADOR, PALABRAS_EN, CANT_BOTONES, sleep } from '../constants/constants';
import { Subject } from 'rxjs';
import { Palabra } from '../models/palabra.interface';

@Injectable({
  providedIn: 'root',
})
export class LogicaService {
  
  botonesPantalla: Palabra[] = [];
  jugador: string[] = [];
  simon: string[] = [];
  palabrasAlAzar: string[] = [];
  contador: number;
  state = new Subject<any>();
  
  constructor() {
    this.contador = START_CONTADOR;
  }
  
  async initJuego() {
    
    this.palabrasAlAzar = await this.seleccionarPalabrasAlAzar( PALABRAS_EN, CANT_BOTONES );
    this.botonesPantalla = await this.generarBotonesPantalla(...this.palabrasAlAzar);
    this.simon = await this.generarSimon( START_CONTADOR, ...this.palabrasAlAzar );
    this.setState();
  }
  
  async generarBotonesPantalla( ...listaPalabras: string[] ): Promise<Palabra[]> {
    
    let promesa = new Promise<Palabra[]>((resolve) => {
      let botonesPantalla: Palabra[] = [];
      for (let i = 0; i < CANT_BOTONES; i++) {
        let {indice,palabra} = this.palabraRandom(listaPalabras);
        botonesPantalla.push({ Palabra: palabra, Active: false });
        listaPalabras.splice(indice,1);
      }
      resolve(botonesPantalla);
    });
    return promesa;
  }
  
  private seleccionarPalabrasAlAzar( lista: string[], cantPalabras: number ): Promise<string[]> {
    let promesa = new Promise<string[]>((resolve) => {
      let palabrasAlAzar: string[] = [];
      for (let i = 0; i < cantPalabras; i++) {
        let random = Math.floor(Math.random() * lista.length);
        palabrasAlAzar.push(lista.splice(random, 1)[0]);
      }
      resolve(palabrasAlAzar);
    });
    return promesa;
  } 
  
  async agregarASimon( incrementar: boolean = false, listaPalabras: string[] ): Promise<string> {
    
    let promesa = new Promise<string>( async resolve => {
      if ( incrementar ) {
        this.contador++;
      }
      let {palabra} = this.palabraRandom(listaPalabras);
      resolve(palabra);
    });
    return promesa;
  }
  
  palabraRandom( listaPalabras: string[] ): { indice: number, palabra: string } {
    let indice = Math.floor(Math.random() * listaPalabras.length);
    let palabra = listaPalabras[indice];
    return {
      indice: indice,
      palabra: palabra
    }
  }
  
  resetearSimon() {
    this.contador = START_CONTADOR;
  }
  
  async acertar( palabra: Palabra ): Promise<boolean> {
    
    this.jugador.push(palabra.Palabra);
    let adivino = await this.compararConSimon( this.jugador, this.simon );
    
    if( adivino ) {
      if( this.jugador.length == this.contador ) {
        let incrementarContador = true;
        let palabra = await this.agregarASimon(incrementarContador, this.palabrasAlAzar);
        this.simon.push(palabra);
        this.jugador = [];
        await sleep(2000);
        this.secuenciaBotones(this.botonesPantalla, this.simon);
      }
    } else {
      this.jugador = [];
      this.contador = START_CONTADOR;
    }
    this.setState();
    return adivino;
  }
  
  async compararConSimon( jugador: string[], simon: string[] ): Promise<boolean> {
    for (let index = 0; index < jugador.length; index++) {
      const element = jugador[index];
      if( element !== simon[index] ) {
        return false;
      }
    }    
    return true;
  }
  
  setState() {
    this.state.next({
      jugador: this.jugador,
      simon: this.simon,
      botonesPantalla: this.botonesPantalla,
      contador: this.contador
    });
  }
  
  generarSimon( contador: number, ...listaPalabras: string[] ): Promise<string[]> {
    let promesa = new Promise<string[]>( resolve => {
      let simon: string[] = [];
      for (let i = 0; i < contador; i++ ) {
        let {palabra}= this.palabraRandom(listaPalabras);
        simon.push(palabra);
      }
      resolve(simon);
    });
    return promesa;
  }

  async comenzar() {
    this.secuenciaBotones(this.botonesPantalla, this.simon);
  }

  async secuenciaBotones( botones: Palabra[], simon: string[] ) {
    for(let palabra of simon) {
      let filtroBoton: Palabra = botones.filter( p => p.Palabra === palabra)[0];
      filtroBoton.Active = true;
      await sleep(1000);
      filtroBoton.Active = false;
      await sleep(1000);
    }
  }
}
