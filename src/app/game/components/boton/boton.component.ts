import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-boton',
  templateUrl: './boton.component.html',
  styleUrls: ['./boton.component.scss'],
})
export class BotonComponent {

  @Input()
  palabra: string;
  @Input()
  active: string;

  @Output()
  acertar: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }
  
  onClick( val: string ) {
    this.acertar.emit(val);
  }
}
