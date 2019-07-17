import { Component, OnInit } from '@angular/core';
import { LogicaService } from '../../services/logica.service';
import { Palabra } from '../../models/palabra.interface';
import { bounceInAnimation } from 'angular-animations';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  animations: [bounceInAnimation({ anchor: 'bounce' })]
})
export class GameComponent implements OnInit {

  simon: Palabra[] = [];
  jugador: string[] = [];
  contador: number = 0;
  botonesPantalla: Palabra[] = [];
  bounce: boolean = false;

  constructor(
    private logica: LogicaService
  ) { }

  async ngOnInit() {
    this.logica.state.subscribe( state => {
      this.botonesPantalla = state.botonesPantalla;
      this.simon = state.simon;
      this.jugador = state.jugador;
      this.contador = state.contador;
      
    } );
    await this.logica.initJuego();
  }

  async acertarPalabra( palabra: Palabra ) { 
    await this.logica.acertar(palabra);
  }

  async comenzarJuego() {
    await this.logica.comenzar();
  }

}
