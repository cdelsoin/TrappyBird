import { Component } from '@angular/core'

// import pixi, p2 and phaser ce
import "pixi"
import "p2"
import * as Phaser from "phaser-ce"

@Component({
  selector: 'page-game',
  templateUrl: 'game.html'
})
export class GamePage {

  game: Phaser.Game
  stage: Phaser.Stage
  sprite: Phaser.Sprite

  constructor() {
      this.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'content', { create: this.create, preload: this.preload, update: this.update })
  }

  preload() {
    this.game.load.image('bird', 'assets/sprite/bird.png')
  }

  create() {
      this.stage.backgroundColor = '#fff'

      // Change the background color of the game to blue
      this.game.stage.backgroundColor = '#003bb3'

      // Set the physics system
      this.game.physics.startSystem(Phaser.Physics.ARCADE)

      // Display the bird at the position x=100 and y=245
      // this.bird = game.add.sprite(100, 245, 'bird')
      // this.birdSprite(100, 245, 'bird')
      this.sprite = this.game.add.sprite(100, 245, 'bird')

      // Add physics to the bird
      // Needed for: movements, gravity, collisions, etc.
      this.game.physics.arcade.enable(this.sprite)

      // Add gravity to the bird to make it fall
      this.sprite.body.gravity.y = 1000

      // Call the 'jump' function when the spacekey is hit
      this.game.input.onTap.add(function(){
        this.sprite.body.velocity.y = -350
      }, this)
  }

  // Make the bird jump
  jump() {
      // Add a vertical velocity to the bird
      this.sprite.body.velocity.y = -350
  }

  // Restart the game
  restartGame() {
      // Start the 'main' state, which restarts the game
      // this.game.state.start('main')
  }


  update() {

    // If the bird is out of the screen (too high or too low)
    // Call the 'restartGame' function
    if (this.sprite.y < 0 || this.sprite.y > window.innerHeight) {
      // this.restartGame()
      this.sprite.y = 245
      // this.sprite.body.gravity.y = 1000
      this.sprite.body.velocity.y = 0

    }

  }

  // ngOnInit () {
  //
  // }

  ngAfterViewInit() {
    console.log('this', this)
  }
}
