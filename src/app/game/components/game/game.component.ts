import { Component, OnInit } from '@angular/core';
import { LogicaService } from '../../services/logica.service';
import { sleep } from '../../constants/constants';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {

  simon: string[] = [];
  jugador: string[] = [];
  palabrasAlAzar: string[] = [];
  contador: number = 0;
  copiaSimon: any[] = [];

  constructor(
    private logica: LogicaService
  ) { }

  async ngOnInit() {
    this.logica.state.subscribe( state => {
      this.simon = state.simon;
      this.jugador = state.jugador;
      this.contador = state.contador;
      
    } );
    await this.comenzarJuego();
  }

  async acertarPalabra(val: string) { 
    console.log(`acertarPalabra ${await this.logica.acertar(val)}`);
  }

  async comenzarJuego() {
    this.simon = await this.logica.generarSimon();
    this.palabrasAlAzar = this.logica.palabrasAlAzar;
    console.log(this.palabrasAlAzar);
  }

}
