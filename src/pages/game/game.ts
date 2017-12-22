import { Component } from '@angular/core'

// import pixi, p2 and phaser ce
import "pixi"
import "p2"
import * as Phaser from "phaser-ce"

// now import game states
import { Start } from './states/start'
import { How } from './states/how'
import { Play } from './states/play'

@Component({
  selector: 'page-game',
  templateUrl: 'game.html'
})
export class GamePage extends Phaser.Game {

  constructor() {
      super(window.innerWidth, window.innerHeight, Phaser.AUTO, 'content')

      this.state.add('Start', Start, false);
      this.state.add('Play', Play, false);
      this.state.add('How', How, false);

      this.state.start('Start')
  }

}
