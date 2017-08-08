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
  // coin: Phaser.Sprite

  constructor() {
      this.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'content', { create: this.create, preload: this.preload, update: this.update })
  }

  preload() {
    this.game.load.image('bird', 'assets/sprite/trappy-bird.png')
    // this.game.load.spritesheet('birdsheet', 'assets/sprite/trappy-bird.png', 50, 50)
  }

  create() {
      this.stage.backgroundColor = '#fff'

      // Change the background color of the game to blue
      this.game.stage.backgroundColor = '#445669'

      // Set the physics system
      this.game.physics.startSystem(Phaser.Physics.ARCADE)

      // Display the bird at the position x=100 and y=245
      this.sprite = this.game.add.sprite(100, 245, 'bird')

      // Display bird spritesheet animation
      // this.sprite = this.game.add.sprite(100, 245, 'birdsheet')
      // this.sprtie.frame = 3


      this.sprite.scale.x = 0.3
      this.sprite.scale.y = 0.3

      // Add physics to the bird
      // Needed for: movements, gravity, collisions, etc.
      this.game.physics.arcade.enable(this.sprite)

      // Add gravity to the bird to make it fall
      this.sprite.body.gravity.y = 1000

      // Call the 'jump' function when screen is tapped
      this.game.input.onTap.add(GamePage.prototype.jump, this)

  }

  update() {
    // If the bird is out of the screen (too high or too low)
    // Call the 'restartGame' function
    if (this.sprite.y < 0 || this.sprite.y > window.innerHeight) {
      this.sprite.y = 245 // puts the sprite back at its starting point
      this.sprite.body.velocity.y = 0 // slows sprite down to stop
    }

  }

  // Make the bird jump
  jump() {
      // Add a vertical velocity to the bird
      this.sprite.body.velocity.y = -400
  }

  // Restart the game
  restartGame() {
      // Start the 'main' state, which restarts the game
      // this.game.state.start('main')
      this.sprite.y = 245 // puts the sprite back at its starting point
      this.sprite.body.velocity.y = 0 // slows sprite down to stop
  }

  // ngOnInit () {
  //
  // }

  ngAfterViewInit() {
    // console.log('this', this)
  }
}
