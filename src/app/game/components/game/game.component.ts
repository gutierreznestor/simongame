import { Component, OnInit } from '@angular/core';
import { LogicaService } from '../../services/logica.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {

  simon: string[] = [];
  palabrasAlAzar: string[] = [];

  constructor(
    private logica: LogicaService
  ) { }

  async ngOnInit() {
    this.logica.state.subscribe( state => console.dir(state) );
    this.simon = await this.logica.generarSimon();
    this.palabrasAlAzar = this.logica.cuatroPalabrasAlAzar;
  }

  adivinarPalabra(val: string) { 
    this.logica.adivinar(val);
  }

}
