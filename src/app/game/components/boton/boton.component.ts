import { Component, Input, Output, EventEmitter } from '@angular/core';
import { rubberBandAnimation, pulseAnimation, swingAnimation } from 'angular-animations';
import { Palabra } from '../../models/palabra.interface';

@Component({
  selector: 'app-boton',
  templateUrl: './boton.component.html',
  styleUrls: ['./boton.component.scss'],
  animations: [
    rubberBandAnimation({ anchor: 'rubberBand', direction: '=>', duration: 900 }),
    swingAnimation({ anchor: 'swing' }),
  ]
})
export class BotonComponent {

  @Input()
  palabra: Palabra;

  @Output()
  acertar: EventEmitter<Palabra> = new EventEmitter<Palabra>();

  click: boolean = false;

  constructor() { }
  
  async onClick( val: Palabra ) {
    this.acertar.emit(val);
    this.click = false;
    await setTimeout(() => {
      this.click = true;
    }, 1);
  }
}
