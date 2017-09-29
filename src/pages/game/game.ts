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
  trappy: Phaser.Sprite
  city: Phaser.Sprite
  coin: Phaser.Sprite
  arrow: Phaser.Sprite
  arrows: any
  coins: any
  floor: any
  scoreCounter: number
  scoreLabel: any
  levelLabel: any
  currentLevel: number
  currentTimeElapsed: any
  timer: any
  levelOneLoop: any
  levelTwoLoop: any
  levelThreeLoop: any
  levelFourLoop: any
  levelFiveLoop: any
  isLevelOne: boolean
  isLevelTwo: boolean
  isLevelThree: boolean
  isLevelFour: boolean
  isLevelFive: boolean
  flapAudio: any
  coinAudio: any

  constructor() {
      this.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'content', { create: this.create, preload: this.preload, update: this.update })
  }

  preload() {
    this.game.load.image('background', 'assets/stage/background-night-2x.png')
    this.game.load.image('floor', 'assets/stage/floor-night.png')
    this.game.load.image('coin', 'assets/sprite/coin.png')
    this.game.load.spritesheet('trappysheet', 'assets/sprite/trappy-spritesheet.png', 162, 174)
    this.game.load.spritesheet('arrowsheet', 'assets/sprite/arrow-spritesheet.png', 189, 72)
    this.game.load.audio('flap', 'assets/audio/wing-flap.wav')
    this.game.load.audio('coin', 'assets/audio/coin.wav')
  }

  create() {
    // Change the background color of the game to blue
    this.game.stage.backgroundColor = '#445669'

    // Set the physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE)

    // Display the different visual elements
    // z-index is decided by order of load (Last to load = on top)
    this.floor = this.game.add.tileSprite(0, window.innerHeight-82, 1500, 265, 'floor')
    this.city = this.game.add.sprite(0, window.innerHeight-225, 'background')

    // add the Trappy Spritesheet
    this.trappy = this.game.add.sprite(100, 245, 'trappysheet')
    // name the animation
    this.trappy.animations.add('flap')

    // play the animation .play(name, fps, loop?)
    this.trappy.animations.play('flap', 15, true)

    // Resize Trappy
    this.trappy.scale.x = 0.3
    this.trappy.scale.y = 0.3

    // Resize city background to fit screen
    this.city.scale.x = 0.3
    this.city.scale.y = 0.3

    // Make group for coins to sit in
    this.coins = this.game.add.group()

    // Create coins every 1.25 seconds by calling createCoins()
    this.game.time.events.loop(1250, GamePage.prototype.createCoins, this)

    // Create group for arrows
    this.arrows = this.game.add.group()

    // Create arrows every second by calling createArrows()
    // this.game.time.events.loop(1000, GamePage.prototype.createArrows, this)


    // Add physics to Trappy
    // Needed for: movements, gravity, collisions, etc.
    this.game.physics.arcade.enable(this.trappy)

    // Add gravity to the Trappy to make it fall
    this.trappy.body.gravity.y = 1400

    // Call the 'jump' function when screen is tapped
    this.game.input.onTap.add(GamePage.prototype.jump, this)

    // add audio clips to the game
    this.flapAudio = this.game.add.audio('flap')
    this.coinAudio = this.game.add.audio('coin')

    // This is our score that goes up each time a coin is collected
    // collection and counting happen in update()
    this.scoreCounter = 0
    this.scoreLabel = this.game.add.text(20, 50, "0", { font: "20px Arial", fill: "#ffffff" })

    this.currentLevel = 1
    this.levelLabel = this.game.add.text(20, 20, "0", { font: "20px Arial", fill: "#ffffff" })
    this.levelLabel.text = 'LVL' + ' ' + this.currentLevel

    this.trappy.anchor.setTo(-0.2, 0.5)

    this.timer = this.game.time.create(false)
    this.timer.start()

  }

  update() {
    this.currentTimeElapsed = Math.floor((this.timer._now - this.timer._started) / 1000)

    // Reset Trappy's position if hits the floor or the ceiling
    if (this.trappy.y > window.innerHeight-117) {
      this.trappy.y = 245 // puts the sprite back at its starting point
      this.trappy.body.velocity.y = 0 // slows sprite down to stop

      // reset score
      this.scoreCounter = 0
      this.scoreLabel.text = this.scoreCounter

      // reset levels
      this.isLevelOne = false
      this.isLevelTwo = false
      this.isLevelThree = false
      this.isLevelFour = false
      this.isLevelFive = false

      // reset arrow loops
      this.game.time.events.remove(this.levelOneLoop)
      this.game.time.events.remove(this.levelTwoLoop)
      this.game.time.events.remove(this.levelThreeLoop)
      this.game.time.events.remove(this.levelFourLoop)
      this.game.time.events.remove(this.levelFiveLoop)
      this.game.time.events.remove(this.levelFiveLoop)

      // restart the timer
      this.timer.destroy()
      this.timer = this.game.time.create(false)
      this.timer.start()

    }

    // Add repeating floor animation
    this.floor.tilePosition.x -= 2

    // Call updateScore when a Trappy overlaps with a coin
    this.game.physics.arcade.overlap( this.trappy, this.coins, GamePage.prototype.updateScore, null, this)

    // Call killTrappy when a Trappy overlaps with an arrow
    this.game.physics.arcade.overlap( this.trappy, this.arrows, GamePage.prototype.killTrappy, null, this)

    if (this.trappy.angle < 30)
    this.trappy.angle += 1

    this.levelLabel.text = 'LVL' + ' ' + this.currentLevel

    // // lets set difficulty (by spawning arrows)
    if (this.currentTimeElapsed === 1 ) {
      if (this.isLevelOne) return
      this.levelOneLoop = this.game.time.events.repeat(1000, 16, GamePage.prototype.createArrows, this)
      this.isLevelOne = true
      this.currentLevel = 1
    }

    if (this.currentTimeElapsed === 16) {
      if (this.isLevelTwo) return
      this.levelTwoLoop = this.game.time.events.repeat(800, 19, GamePage.prototype.createArrows, this)
      this.isLevelTwo = true
      this.currentLevel = 2
    }

    if (this.currentTimeElapsed === 30) {
      if (this.isLevelThree) return
      this.levelThreeLoop = this.game.time.events.repeat(600, 26, GamePage.prototype.createArrows, this)
      this.isLevelThree = true
      this.currentLevel = 3
    }

    if (this.currentTimeElapsed === 46) {
      if (this.isLevelFour) return
      this.levelFourLoop = this.game.time.events.repeat(400, 38, GamePage.prototype.createArrows, this)
      this.isLevelFour = true
      this.currentLevel = 4
    }

    if (this.currentTimeElapsed === 61) {
      if (this.isLevelFive) return
      this.levelFiveLoop = this.game.time.events.loop(200, GamePage.prototype.createArrows, this)
      this.isLevelFive = true
      this.currentLevel = 6
    }

  }

  // Make Trappy jump
  jump() {
    // Add a vertical velocity to Trappy
    this.trappy.body.velocity.y = -400

    //play a flap sound
    this.flapAudio.play()

    // Create an animation on Trappy
    var animation = this.game.add.tween(this.trappy)

    // Change the angle of Trappy to -30° in 100 milliseconds
    animation.to({angle: -30}, 100)

    // And start the animation
    animation.start()
  }

  createCoins () {
    // this chooses what range the coin can spawn in
    this.coin = this.game.add.sprite(window.innerWidth, this.game.rnd.integerInRange(5, window.innerHeight-120), 'coin')
    this.coins.add(this.coin)
    this.game.physics.arcade.enable(this.coin)

    // Size coin and add velocity
    this.coin.scale.x = 0.2
    this.coin.scale.y = 0.2
    this.coin.body.velocity.x = -150

    // Kill the coin if it leaves the bounds of the world
    this.coin.checkWorldBounds = true
    this.coin.outOfBoundsKill = true


  }

  createArrows () {
    // this chooses what range the coin can spawn in
    this.arrow = this.game.add.sprite(window.innerWidth, this.game.rnd.integerInRange(5, window.innerHeight-120), 'arrowsheet')
    this.arrows.add(this.arrow)
    this.game.physics.arcade.enable(this.arrow)

    // name the animation
    this.arrow.animations.add('shoot')

    // play the animation .play(name, fps, loop?)
    this.arrow.animations.play('shoot', 20, true)

    // Size arrow and add velocity
    this.arrow.scale.x = 0.25
    this.arrow.scale.y = 0.25
    this.arrow.body.velocity.x = -220

    // Kill the arrow if it leaves the bounds of the world
    this.arrow.checkWorldBounds = true
    this.arrow.outOfBoundsKill = true
  }

  updateScore (trappy, coins) {
    // if the coin is already dead then don't do anything
    if (!coins.alive) {
      return
    }
    // Okay, it is alive, so kill it and increment the score!
    coins.kill()
    this.coinAudio.play()
    this.scoreCounter += 1
    this.scoreLabel.text = this.scoreCounter

  }

  killTrappy (trappy, arrows) {
    if (!arrows.alive) {
      return
    }

    arrows.kill()

    this.trappy.y = 245 // puts the sprite back at its starting point
    this.trappy.body.velocity.y = 0 // slows sprite down to stop

    // reset score
    this.scoreCounter = 0
    this.scoreLabel.text = this.scoreCounter

    // reset levels
    this.isLevelOne = false
    this.isLevelTwo = false
    this.isLevelThree = false
    this.isLevelFour = false
    this.isLevelFive = false

    // reset arrow loops
    this.game.time.events.remove(this.levelOneLoop)
    this.game.time.events.remove(this.levelTwoLoop)
    this.game.time.events.remove(this.levelThreeLoop)
    this.game.time.events.remove(this.levelFourLoop)
    this.game.time.events.remove(this.levelFiveLoop)
    this.game.time.events.remove(this.levelFiveLoop)

    // restart the timer
    this.timer.destroy()
    this.timer = this.game.time.create(false)
    this.timer.start()
  }

}
