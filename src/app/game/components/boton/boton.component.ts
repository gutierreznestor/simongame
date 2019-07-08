import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-boton',
  templateUrl: './boton.component.html',
  styleUrls: ['./boton.component.scss'],
})
export class BotonComponent implements OnInit {

  @Input() palabra: string;
  constructor() { }

  ngOnInit() {}

  onClick() {
    console.log(this.palabra);
    
  }

}
