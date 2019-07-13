import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Palabra } from '../../models/palabra.interface';

@Component({
  selector: 'app-boton',
  templateUrl: './boton.component.html',
  styleUrls: ['./boton.component.scss'],
})
export class BotonComponent {

  @Input()
  palabra: Palabra;

  @Output()
  acertar: EventEmitter<Palabra> = new EventEmitter<Palabra>();

  constructor() { }
  
  onClick( val: Palabra ) {
    this.acertar.emit(val);
  }
}
