import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from "@ionic/angular";

// componentes
import { GameComponent } from './components/game/game.component';
import { BotonComponent } from './components/boton/boton.component';

// servicios
import { LogicaService } from './services/logica.service';

const components = [
  GameComponent, BotonComponent,
];

@NgModule({
  schemas: [],
  declarations: [components],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [components]
})
export class GameModule { }
