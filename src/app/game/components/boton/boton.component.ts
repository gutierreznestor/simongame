import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-boton',
  templateUrl: './boton.component.html',
  styleUrls: ['./boton.component.scss'],
})
export class BotonComponent {

  @Input()
  palabra: string;

  @Output()
  adivinar: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }
  
  onClick( val: string ) {
    this.adivinar.emit(val);
  }
}
