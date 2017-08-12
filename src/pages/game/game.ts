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
  coin: Phaser.Sprite
  coins: any
  floor: any
  scoreCounter: number
  scoreLabel: any

  constructor() {
      this.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'content', { create: this.create, preload: this.preload, update: this.update })
  }

  preload() {
    this.game.load.image('background', 'assets/stage/background-night.png')
    this.game.load.image('floor', 'assets/stage/floor-night.png')
    this.game.load.image('trappy', 'assets/sprite/trappy-bird.png')
    this.game.load.image('coin', 'assets/sprite/coin.png')
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

      // Make group for coins to sit in
      this.coins = this.game.add.group()

      // Create coins every 1.25 seconds
      // Size coin and add velocity
      this.game.time.events.loop(1250, function (this) {
        // this chooses what range the coin can spawn in
        this.coin = this.game.add.sprite(window.innerWidth, this.game.rnd.integerInRange(5, window.innerHeight-120), 'coin')
        this.coins.add(this.coin)
        this.game.physics.arcade.enable(this.coin)
        this.coin.scale.x = 0.2
        this.coin.scale.y = 0.2
        this.coin.body.velocity.x = -150

        // Kill the coin if it leaves the bounds of the world
        this.coin.checkWorldBounds = true
        this.coin.outOfBoundsKill = true
      }, this)

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

      // This is our score that goes up each time a coin is collected
      // collection and counting happen in update()
      this.scoreCounter = 0
      this.scoreLabel = this.game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" })

      this.sprite.anchor.setTo(-0.2, 0.5);

  }

  update() {
    // Reset Trappy's position if hits the floor or the ceiling
    if (this.sprite.y > window.innerHeight-117) {
      this.sprite.y = 245 // puts the sprite back at its starting point
      this.sprite.body.velocity.y = 0 // slows sprite down to stop

      this.scoreCounter = 0
      this.scoreLabel.text = this.scoreCounter
    }

    // Add repeating floor animation
    this.floor.tilePosition.x -= 2

    // When a Trappy collides with a coin
    // +1 to score and kill the coin
    this.game.physics.arcade.overlap( this.sprite, this.coins, function(this) {
      var coin = this.coins.children[0]
      this.coins.remove(coin)
      this.scoreCounter += 1
      this.scoreLabel.text = this.scoreCounter
    }, null, this)

    if (this.sprite.angle < 20)
    this.sprite.angle += 1;

  }

  // Make Trappy jump
  jump() {
    // Add a vertical velocity to Trappy
    this.sprite.body.velocity.y = -400

    // Create an animation on the bird
    var animation = this.game.add.tween(this.sprite);

    // Change the angle of the bird to -20° in 100 milliseconds
    animation.to({angle: -40}, 100);

    // And start the animation
    animation.start();
  }

  // Restart the game
  // restartGame() {
  //     Start the 'main' state, which restarts the game
  //     this.game.state.start('main')
  // }

  // ngOnInit () {
  //
  // }

  // ngAfterViewInit() {
  //   console.log('this', this)
  //   console.log('this.game', this.game)
  // }
}
