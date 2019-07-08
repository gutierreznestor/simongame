import { Component, OnInit } from '@angular/core';
import { LogicaService } from '../../services/logica.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {

  constructor(
    private juego: LogicaService
  ) { }

  ngOnInit() {}

}
