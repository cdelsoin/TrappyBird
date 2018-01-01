import "pixi"
import "p2"
import * as Phaser from "phaser-ce"

export class Start extends Phaser.State {

  game: Phaser.Game
  stage: Phaser.Stage
  icy: Phaser.Sprite
  city: any
  snow:any
  floor: any
  banner: Phaser.Sprite
  startButton: any
  howButton: any

  preload() {

    this.game.load.image('background', 'assets/stage/background-night-2x.png')
    // this.game.load.image('snow', 'assets/stage/snowflakes.png')
    this.game.load.image('floor', 'assets/stage/floor-night.png')
    this.game.load.image('banner', 'assets/sprite/icy-bird-lockup.png')
    this.game.load.image('startButton', 'assets/buttons/icy-start.png')
    this.game.load.image('howButton', 'assets/buttons/icy-help.png')


    this.game.load.spritesheet('icysheet', 'assets/sprite/icy-spritesheet.png', 180, 114)
  }

  create() {
    // Change the background color of the game to blue
    this.game.stage.backgroundColor = '#445669'

    // Set the physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE)

    // Display the different visual elements
    // z-index is decided by order of load (Last to load = on top)
    this.city = this.game.add.tileSprite(0, window.innerHeight-225, 1500, 510,'background')
    // this.snow = this.game.add.tileSprite(0, 0, 1500, window.innerHeight,'snow')
    this.floor = this.game.add.tileSprite(0, window.innerHeight-82, 1500, 265, 'floor')
    this.banner = this.game.add.sprite(this.game.world.centerX, window.innerHeight-550, 'banner')
    this.startButton = this.game.add.button(this.game.world.centerX-35, window.innerHeight-300, 'startButton', Start.prototype.startGame)
    this.howButton = this.game.add.button(this.game.world.centerX+70, window.innerHeight-300, 'howButton', Start.prototype.howTo)

    // add the Icy Spritesheet
    this.icy = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY-105, 'icysheet')
    // name the animation
    this.icy.animations.add('flap')

    // play the animation .play(name, fps, loop?)
    this.icy.animations.play('flap', 10, true)

    // Resize Assets
    this.icy.scale.x = 0.4
    this.icy.scale.y = 0.4

    this.city.scale.x = 0.3
    this.city.scale.y = 0.3

    // this.snow.scale.x = 0.3
    // this.snow.scale.y = 0.3

    this.banner.scale.x = 0.4
    this.banner.scale.y = 0.4

    this.startButton.scale.x = 0.25
    this.startButton.scale.y = 0.25

    this.howButton.scale.x = 0.25
    this.howButton.scale.y = 0.25

    // set anchors to center of img
    this.banner.anchor.setTo(0.5, 0.5)
    this.icy.anchor.setTo(0.5, 0.5)
    this.startButton.anchor.setTo(0.5, 0.5)
    this.howButton.anchor.setTo(0.5, 0.5)


    // Add physics to Icy
    // Needed for: movements, gravity, collisions, etc.
    this.game.physics.arcade.enable(this.icy)
  }

  update() {

    // Add repeating floor animation
    this.floor.tilePosition.x -= 2
    this.city.tilePosition.x -= 1.3
    // this.snow.tilePosition.x -= 2
  }

  startGame() { // lets start playing IcyBird
    this.game.state.start('Play', true, false);
  }

  howTo() { // loads How state
    this.game.state.start('How', true, false);
  }
}
