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
  city: Phaser.Sprite
  // coin: Phaser.Sprite
  floor: any

  constructor() {
      this.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'content', { create: this.create, preload: this.preload, update: this.update })
  }

  preload() {
    this.game.load.image('background', 'assets/stage/background-night.png')
    this.game.load.image('floor', 'assets/stage/floor-night.png')
    this.game.load.image('trappy', 'assets/sprite/trappy-bird.png')
    // this.game.load.spritesheet('trappysheet', 'assets/sprite/trappy-bird.png', 50, 50) // EXAMPLE CODE
  }

  create() {

      // Change the background color of the game to blue
      this.game.stage.backgroundColor = '#445669'

      // Set the physics system
      this.game.physics.startSystem(Phaser.Physics.ARCADE)

      // Display the different visual elements
      // z-index is decided by order of load (Last to load = on top)
      this.floor = this.game.add.tileSprite(0, window.innerHeight-82, 1500, 265, 'floor')
      this.city = this.game.add.sprite(0, window.innerHeight-241, 'background')
      this.sprite = this.game.add.sprite(100, 245, 'trappy')

      // Resize Trappy
      this.sprite.scale.x = 0.3
      this.sprite.scale.y = 0.3

      // Resize city background to fit screen
      this.city.scale.x = 1.05

      // (EXAMPLE CODE) Display Trappy spritesheet animation
      // this.sprite = this.game.add.sprite(100, 245, 'trappysheet')
      // this.sprtie.frame = 3

      // Add physics to Trappy
      // Needed for: movements, gravity, collisions, etc.
      this.game.physics.arcade.enable(this.sprite)

      // Add gravity to the Trappy to make it fall
      this.sprite.body.gravity.y = 1000

      // Call the 'jump' function when screen is tapped
      this.game.input.onTap.add(GamePage.prototype.jump, this)

  }

  update() {
    // Reset Trappy's position if hits the floor or the ceiling
    if (this.sprite.y < 0 || this.sprite.y > window.innerHeight-117) {
      this.sprite.y = 245 // puts the sprite back at its starting point
      this.sprite.body.velocity.y = 0 // slows sprite down to stop
    }

    // Add repeating floor animation
    this.floor.tilePosition.x -= 2

  }

  // Make Trappy jump
  jump() {
      // Add a vertical velocity to the Trappy
      this.sprite.body.velocity.y = -400
  }

  // Restart the game
  restartGame() {
      // Start the 'main' state, which restarts the game
      // this.game.state.start('main')
  }

  // ngOnInit () {
  //
  // }

  // ngAfterViewInit() {
  //   console.log('this', this)
  // }
}
