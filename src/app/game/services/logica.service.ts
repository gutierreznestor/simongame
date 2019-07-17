import { Injectable } from '@angular/core';

import { START_CONTADOR, PALABRAS_EN, CANT_BOTONES, sleep, INTERVALO_SECUENCIA } from '../constants/constants';
import { Subject } from 'rxjs';
import { Palabra } from '../models/palabra.interface';
import { Contador as Puntaje } from '../models/contador.interface';

@Injectable({
  providedIn: 'root',
})
export class LogicaService {
  
  botonesPantalla: Palabra[] = [];
  jugador: string[] = [];
  simon: string[] = [];
  palabrasAlAzar: string[] = [];
  puntaje$ = new Subject<Puntaje>();
  state = new Subject<any>();
  
  constructor() {
    let puntaje = { contador: START_CONTADOR, active: false }
    this.puntaje$.next(puntaje);
  }
  
  async initJuego() {
    
    this.palabrasAlAzar = await this.seleccionarPalabrasAlAzar( PALABRAS_EN, CANT_BOTONES );
    this.botonesPantalla = await this.generarBotonesPantalla(...this.palabrasAlAzar);
    this.simon = await this.generarSimon( START_CONTADOR, ...this.palabrasAlAzar );
    this.setState();
    this.setPuntaje(0,true);
  }
  
  async generarBotonesPantalla( ...listaPalabras: string[] ): Promise<Palabra[]> {
    
    let botonesPantalla: Palabra[] = [];
    for (let i = 0; i < CANT_BOTONES; i++) {
      let {indice,palabra} = this.palabraRandom(listaPalabras);
      botonesPantalla.push({ Palabra: palabra, Active: false });
      listaPalabras.splice(indice,1);
    }
    return Promise.resolve(botonesPantalla);
  }
  
  private seleccionarPalabrasAlAzar( lista: string[], cantPalabras: number ): Promise<string[]> {

    let palabrasAlAzar: string[] = [];
    for (let i = 0; i < cantPalabras; i++) {
      let random = Math.floor(Math.random() * lista.length);
      palabrasAlAzar.push(lista.splice(random, 1)[0]);
    }
    return Promise.resolve(palabrasAlAzar);
  } 
  
  async palabraParaAgregar( listaPalabras: string[] ): Promise<string> {

    let {palabra} = this.palabraRandom(listaPalabras);
    return Promise.resolve(palabra);
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
    let puntaje: Puntaje = { contador: START_CONTADOR, active: true }
    this.puntaje$.next(puntaje)
  }
  
  async acertar( palabra: Palabra ): Promise<boolean> {
    
    this.jugador.push(palabra.Palabra);
    let adivino = await this.compararConSimon( this.jugador, this.simon );
    let puntaje = await this.puntaje$.toPromise();
    if( adivino ) {
      if( this.jugador.length == puntaje.contador ) {
        await sleep(200);
        this.setState();
        puntaje.contador++
        this.setPuntaje(puntaje.contador, true);
        let palabra = await this.palabraParaAgregar(this.palabrasAlAzar);
        this.simon.push(palabra);
        this.jugador = [];
        await sleep(1500);
        this.secuenciaBotones(this.botonesPantalla, this.simon);
      }
    } else {
      this.jugador = [];
      this.setPuntaje(START_CONTADOR, true);
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
    });
  }
  
  generarSimon( contador: number, ...listaPalabras: string[] ): Promise<string[]> {
    let simon: string[] = [];
    for (let i = 0; i < contador; i++ ) {
      let {palabra}= this.palabraRandom(listaPalabras);
      simon.push(palabra);
    }
    return Promise.resolve(simon);
  }

  async comenzar() {
    this.secuenciaBotones(this.botonesPantalla, this.simon);
  }

  async secuenciaBotones( botones: Palabra[], simon: string[] ) {
    for(let palabra of simon) {
      let filtroBoton: Palabra = botones.filter( p => p.Palabra === palabra)[0];
      filtroBoton.Active = false;
      await setTimeout(() => {
        filtroBoton.Active = true;
      }, 1);
      await sleep(INTERVALO_SECUENCIA);
    }
  }

  setPuntaje( contador: number, active: boolean ) {
    this.puntaje$.next({
      contador: contador,
      active: active
    });
  }
}
