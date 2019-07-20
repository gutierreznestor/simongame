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
  botonesPantalla$ = this.logica.botonesPantalla$;

  constructor(
    private logica: LogicaService
  ) { }

  async ngOnInit() {
    this.logica.puntaje$.subscribe( contador => {
      this.contador = contador.contador;
    });
    await this.logica.initJuego();

  }

  async acertarPalabra( palabra: Palabra ) { 
    await this.logica.acertar(palabra);
  }

  async comenzarJuego() {
    await this.logica.comenzar();
  }

}
