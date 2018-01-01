import "pixi"
import "p2"
import * as Phaser from "phaser-ce"

export class Play extends Phaser.State {

  game: Phaser.Game
  stage: Phaser.Stage
  trappy: Phaser.Sprite
  city: any
  coin: Phaser.Sprite
  scoreCoin: Phaser.Sprite
  arrow: Phaser.Sprite
  retryButton: any
  homeButton: any
  isTrappyDead: boolean
  isTrappyDying: boolean
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
    this.game.load.image('banner', 'assets/sprite/trappy-lockup.png')
    this.game.load.image('retryButton', 'assets/buttons/retry.png')
    this.game.load.image('homeButton', 'assets/buttons/home.png')


    this.game.load.spritesheet('trappysheet', 'assets/sprite/trappy-spritesheet.png', 162, 174)
    // this.game.load.spritesheet('trappysheet', 'assets/sprite/gunter-spritesheet.png', 48, 52)
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

    // add the Trappy Spritesheet
    this.trappy = this.game.add.sprite(100, 180, 'trappysheet')
    this.isTrappyDead = false
    this.isTrappyDying = false
    // name the animation
    this.trappy.animations.add('flap')

    // play the animation .play(name, fps, loop?)
    this.trappy.animations.play('flap', 15, true)

    // Resize Trappy
    this.trappy.scale.x = 0.3
    this.trappy.scale.y = 0.3
    // this.trappy.scale.x = 0.8
    // this.trappy.scale.y = 0.8

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

    // Reset Trappy's position if hits the floor
    if (this.trappy.y > window.innerHeight-117) {

      if (this.isTrappyDead) {
        return
      }

      this.isTrappyDead = true
      this.trappy.animations.stop()
      this.trappy.body.velocity.y = 0
      this.trappy.body.gravity.y = 0



      this.retryButton = this.game.add.button(this.game.world.centerX-35, window.innerHeight-300, 'retryButton', Play.prototype.startGame)
      this.retryButton.scale.x = 0.25
      this.retryButton.scale.y = 0.25
      this.retryButton.anchor.setTo(0.5, 0.5)

      this.homeButton = this.game.add.button(this.game.world.centerX+70, window.innerHeight-300, 'homeButton', Play.prototype.goHome)
      this.homeButton.scale.x = 0.25
      this.homeButton.scale.y = 0.25
      this.homeButton.anchor.setTo(0.5, 0.5)

    } else { // if Trappy hasn't hit the floor yet

      // Add repeating floor animation
      this.floor.tilePosition.x -= 2
      this.city.tilePosition.x -= 1.3

      // Call updateScore when a Trappy overlaps with a coin
      this.game.physics.arcade.overlap( this.trappy, this.coins, Play.prototype.updateScore, null, this)

      // Call killTrappy when a Trappy overlaps with an arrow
      this.game.physics.arcade.overlap( this.trappy, this.arrows, Play.prototype.killTrappy, null, this)

      // this keeps Trappy straight before the user starts playing
      if (!this.theFirstTap) {
        if (this.trappy.angle < 30)
        this.trappy.angle += 1
      }
    }



  }

  // Make Trappy jump
  jump() {

    if (this.theFirstTap) {
      // Create coins every 1.25 seconds by calling createCoins()
      this.game.time.events.loop(1250, Play.prototype.createCoins, this)
      this.game.time.events.loop(500, Play.prototype.createArrows, this)


      // Add physics to Trappy
      // Needed for: movements, gravity, collisions, etc.
      this.game.physics.arcade.enable(this.trappy)

      // Add gravity to the Trappy to make it fall
      this.trappy.body.gravity.y = 1400
      this.trappy.anchor.setTo(-0.2, 0.5)

      this.theFirstTap = false
    }

    if (this.isTrappyDead || this.isTrappyDying) return
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

  updateScore (trappy, coins) {

    // dont collect coins or update score if Trappy is dying or is dead
    if (this.isTrappyDead || this.isTrappyDying) return
    // if the coin is already dead then don't do anything
    if (!coins.alive) return
    // Okay, it is alive, so kill it and increment the score!
    coins.kill()
    this.coinAudio.play("", 0, 0.2)
    this.scoreCounter += 1
    this.scoreLabel.text = this.scoreCounter

  }

  killTrappy (trappy, arrows) {

    // dont kill trappy, he's already dying
    if (this.isTrappyDying) return

    this.isTrappyDying = true
    this.trappy.animations.stop()

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