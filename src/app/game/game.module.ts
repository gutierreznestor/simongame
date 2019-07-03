import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameComponent } from './components/game/game.component';

const components = [
  GameComponent,
];

@NgModule({
  schemas: [],
  declarations: [components],
  imports: [
    CommonModule
  ],
  exports: [components],
})
export class GameModule { }
