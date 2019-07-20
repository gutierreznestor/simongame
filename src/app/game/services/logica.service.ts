import { Injectable } from '@angular/core';

import { START_CONTADOR, PALABRAS_EN, CANT_BOTONES, sleep, INTERVALO_SECUENCIA } from '../constants/constants';
import { Subject } from 'rxjs';
import { Palabra } from '../models/palabra.interface';
import {  Contador } from '../models/contador.interface';

@Injectable({
  providedIn: 'root',
})
export class LogicaService {
  
  botonesPantalla: Palabra[] = [];
  private botonesSubject = new Subject<Palabra[]>();
  botonesPantalla$ = this.botonesSubject.asObservable();
  jugador: string[];
  simon: string[];
  palabrasAlAzar: string[] = [];

  puntaje: Contador = { contador: 0, active: false }
  puntaje$ = new Subject<Contador>();
  
  constructor() {}
  
  async initJuego() {
    this.jugador = [];
    this.simon = [];
    this.palabrasAlAzar = await this.seleccionarPalabrasAlAzar( CANT_BOTONES, ...PALABRAS_EN );
    this.botonesPantalla = await this.generarBotonesPantalla(...this.palabrasAlAzar);
    this.botonesSubject.next(this.botonesPantalla);
    this.simon = await this.generarSimon( START_CONTADOR, ...this.palabrasAlAzar );
    this.puntaje = { contador: START_CONTADOR, active: false }
    this.actualizarPuntaje();    
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
  
  private seleccionarPalabrasAlAzar( cantPalabras: number, ...lista: string[] ): Promise<string[]> {
    
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
    let puntaje: Contador = { contador: START_CONTADOR, active: true }
    this.puntaje$.next(puntaje)
  }
  
  async acertar( palabra: Palabra ): Promise<boolean> {
    
    this.jugador.push(palabra.Palabra);
    let adivino = await this.compararConSimon( this.jugador, this.simon );
    if( adivino ) {
      if( this.jugador.length == this.simon.length ) {
        this.jugador = []
        await this.aumentarPuntaje();
        await this.actualizarPuntaje();
        let palabraNueva = await this.palabraParaAgregar(this.palabrasAlAzar);
        this.simon = [...this.simon, palabraNueva];
        await sleep(1500);        
        await this.secuenciaBotones(this.botonesPantalla,this.simon);
      }
    } else {
      await this.initJuego();
    }
    return Promise.resolve(adivino);
  }
  
  async compararConSimon( jugador: string[], simon: string[] ): Promise<boolean> {
    for (let index = 0; index < jugador.length; index++) {
      const elemeJugador = jugador[index];
      const elemSimon = simon[index];
      if (elemeJugador !== elemSimon ) {
        return Promise.resolve(false);
      }
    }    
    return Promise.resolve(true);
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

  actualizarPuntaje() {
    this.puntaje$.next(this.puntaje);
    return Promise.resolve();
  }

  async aumentarPuntaje() {
    await sleep(1000);
    this.puntaje.contador++;
    return Promise.resolve();
  }
}
