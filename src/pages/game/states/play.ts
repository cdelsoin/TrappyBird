import "pixi"
import "p2"
import * as Phaser from "phaser-ce"

export class Play extends Phaser.State {

  game: Phaser.Game
  stage: Phaser.Stage
  icy: Phaser.Sprite
  city: any
  coin: Phaser.Sprite
  scoreCoin: Phaser.Sprite
  arrow: Phaser.Sprite
  retryButton: any
  homeButton: any
  isIcyDead: boolean
  isIcyDying: boolean
  arrows: any
  coins: any
  floor: any
  scoreCounter: number
  scoreLabel: any
  flapAudio: any
  coinAudio: any
  gruntAudio: any
  theFirstTap: boolean

  preload() {
    this.game.load.image('background', 'assets/stage/background-night-2x.png')
    this.game.load.image('floor', 'assets/stage/floor-night.png')
    this.game.load.image('coin', 'assets/sprite/coin.png')
    this.game.load.image('banner', 'assets/sprite/icy-bird-lockup.png')
    this.game.load.image('retryButton', 'assets/buttons/icy-retry.png')
    this.game.load.image('homeButton', 'assets/buttons/icy-home.png')


    this.game.load.spritesheet('icysheet', 'assets/sprite/icy-spritesheet.png', 180, 114)
    // this.game.load.spritesheet('icysheet', 'assets/sprite/gunter-spritesheet.png', 48, 52)
    this.game.load.spritesheet('arrowsheet', 'assets/sprite/arrow-spritesheet.png', 189, 72)


    this.game.load.audio('flap', 'assets/audio/wing-flap.wav')
    this.game.load.audio('coin', 'assets/audio/coin.wav')
    this.game.load.audio('grunt', 'assets/audio/dead-grunt.wav')
  }

  create() {
    // Change the background color of the game to blue
    this.game.stage.backgroundColor = '#445669'

    // Set the physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE)

    // Display the different visual elements
    // z-index is decided by order of load (Last to load = on top)
    this.city = this.game.add.tileSprite(0, window.innerHeight-225, 1500, 510,'background')
    this.floor = this.game.add.tileSprite(0, window.innerHeight-82, 1500, 265, 'floor')

    // add the Icy Spritesheet
    this.icy = this.game.add.sprite(100, 180, 'icysheet')
    this.isIcyDead = false
    this.isIcyDying = false
    // name the animation
    this.icy.animations.add('flap')

    // play the animation .play(name, fps, loop?)
    this.icy.animations.play('flap', 15, true)

    // Resize Icy
    this.icy.scale.x = 0.3
    this.icy.scale.y = 0.3
    // this.icy.scale.x = 0.8
    // this.icy.scale.y = 0.8

    // Resize city background to fit screen
    this.city.scale.x = 0.3
    this.city.scale.y = 0.3

    // Make group for coins to sit in
    this.coins = this.game.add.group()

    // Create group for arrows
    this.arrows = this.game.add.group()

    // Call the 'jump' function when screen is tapped
    this.game.input.onTap.add(Play.prototype.jump, this)

    // add audio clips to the game
    this.flapAudio = this.game.add.audio('flap')
    this.coinAudio = this.game.add.audio('coin')
    this.gruntAudio = this.game.add.audio('grunt')

    // This is our score that goes up each time a coin is collected
    // collection and counting happen in update()
    this.scoreCounter = 0
    this.scoreCoin = this.game.add.sprite(20, 20, 'coin')
    this.scoreCoin.scale.x = 0.15
    this.scoreCoin.scale.y = 0.15
    this.scoreLabel = this.game.add.text(40, 20, "0", { font: "18px Arial", fill: "#ffffff" })

    this.theFirstTap = true

  }

  update() {

    // Reset Icy's position if hits the floor
    if (this.icy.y > window.innerHeight-125) {

      if (this.isIcyDead) {
        return
      }

      this.isIcyDead = true
      this.icy.animations.stop()
      this.icy.body.velocity.y = 0
      this.icy.body.gravity.y = 0



      this.retryButton = this.game.add.button(this.game.world.centerX-35, window.innerHeight-300, 'retryButton', Play.prototype.startGame)
      this.retryButton.scale.x = 0.25
      this.retryButton.scale.y = 0.25
      this.retryButton.anchor.setTo(0.5, 0.5)

      this.homeButton = this.game.add.button(this.game.world.centerX+70, window.innerHeight-300, 'homeButton', Play.prototype.goHome)
      this.homeButton.scale.x = 0.25
      this.homeButton.scale.y = 0.25
      this.homeButton.anchor.setTo(0.5, 0.5)

    } else { // if Icy hasn't hit the floor yet

      // Add repeating floor animation
      this.floor.tilePosition.x -= 2
      this.city.tilePosition.x -= 1.3

      // Call updateScore when a Icy overlaps with a coin
      this.game.physics.arcade.overlap( this.icy, this.coins, Play.prototype.updateScore, null, this)

      // Call killIcy when a Icy overlaps with an arrow
      this.game.physics.arcade.overlap( this.icy, this.arrows, Play.prototype.killIcy, null, this)

      // this keeps Icy straight before the user starts playing
      if (!this.theFirstTap) {
        if (this.icy.angle < 30)
        this.icy.angle += 1
      }
    }



  }

  // Make Icy jump
  jump() {

    if (this.theFirstTap) {
      // Create coins every 1.25 seconds by calling createCoins()
      this.game.time.events.loop(1250, Play.prototype.createCoins, this)
      this.game.time.events.loop(500, Play.prototype.createArrows, this)


      // Add physics to Icy
      // Needed for: movements, gravity, collisions, etc.
      this.game.physics.arcade.enable(this.icy)

      // Add gravity to the Icy to make it fall
      this.icy.body.gravity.y = 1400
      this.icy.anchor.setTo(0.2, 0.5)

      this.theFirstTap = false
    }

    if (this.isIcyDead || this.isIcyDying) return
    // Add a vertical velocity to Icy
    this.icy.body.velocity.y = -425

    //play a flap sound
    this.flapAudio.play()

    // Create an animation on Icy
    var animation = this.game.add.tween(this.icy)

    // Change the angle of Icy to -30° in 100 milliseconds
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
    // this chooses what range the arrow can spawn in
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

  updateScore (icy, coins) {

    // dont collect coins or update score if Icy is dying or is dead
    if (this.isIcyDead || this.isIcyDying) return
    // if the coin is already dead then don't do anything
    if (!coins.alive) return
    // Okay, it is alive, so kill it and increment the score!
    coins.kill()
    this.coinAudio.play("", 0, 0.2)
    this.scoreCounter += 1
    this.scoreLabel.text = this.scoreCounter

  }

  killIcy (icy, arrows) {

    // dont kill icy, he's already dying
    if (this.isIcyDying) return

    this.isIcyDying = true
    this.icy.animations.stop()

    this.gruntAudio.play("", 0, 0.3)
    // if the arrow is already dead then don't do anything
    if (!arrows.alive) return

    arrows.kill()

  }

  goHome() {
    this.game.state.start('Start', true, false);
  }

  startGame() {
    this.game.state.start('Play', true, false);
  }
}
