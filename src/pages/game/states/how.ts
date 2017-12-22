import "pixi"
import "p2"
import * as Phaser from "phaser-ce"

export class How extends Phaser.State {

  game: Phaser.Game
  stage: Phaser.Stage
  trappy: Phaser.Sprite
  coin: Phaser.Sprite
  arrow: Phaser.Sprite
  city: any
  floor: any
  trappyHowTo: any
  coinHowTo: any
  arrowHowTo: any
  backButton: any


  preload() {
    this.game.load.image('background', 'assets/stage/background-night-2x.png')
    this.game.load.image('floor', 'assets/stage/floor-night.png')
    this.game.load.image('coin', 'assets/sprite/coin.png')
    this.game.load.image('backButton', 'assets/buttons/back.png')

    this.game.load.spritesheet('trappysheet', 'assets/sprite/trappy-spritesheet.png', 162, 174)
    this.game.load.spritesheet('arrowsheet', 'assets/sprite/arrow-spritesheet.png', 189, 72)
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


    // add in back button
    this.backButton = this.game.add.button( 40, 40, 'backButton', How.prototype.goHome)
    // resize & anchor back button
    this.backButton.scale.x = 0.25
    this.backButton.scale.y = 0.25
    this.backButton.anchor.setTo(0.5, 0.5)

    // add the Trappy Spritesheet
    this.trappy = this.game.add.sprite(40, this.game.world.centerY-150, 'trappysheet')
    // name the animation
    this.trappy.animations.add('flap')
    // play the animation .play(name, fps, loop?)
    this.trappy.animations.play('flap', 10, true)
    // Resize Trappy
    this.trappy.scale.x = 0.3
    this.trappy.scale.y = 0.3


    // Resize city background to fit screen
    this.city.scale.x = 0.3
    this.city.scale.y = 0.3


    // add in arrow
    this.arrow = this.game.add.sprite(40, this.game.world.centerY+10, 'arrowsheet')
    // add arrow animation
    this.arrow.animations.add('shoot')
    // play the animation .play(name, fps, loop?)
    this.arrow.animations.play('shoot', 7, true)
    // Size arrow
    this.arrow.scale.x = 0.3
    this.arrow.scale.y = 0.3


    // add in coin
    this.coin = this.game.add.sprite(40, this.game.world.centerY-75, 'coin')
    // Size coin
    this.coin.scale.x = 0.3
    this.coin.scale.y = 0.3

    // add how-to text
    this.trappyHowTo = this.game.add.text(125, this.game.world.centerY-140, "Tap-To-Flap", { font: "20px Arial", fill: "#ffffff" })
    this.arrowHowTo = this.game.add.text(125, this.game.world.centerY+10, "Avoid Arrows", { font: "20px Arial", fill: "#ffffff" })
    this.coinHowTo = this.game.add.text(125, this.game.world.centerY-65, "Collect coins", { font: "20px Arial", fill: "#ffffff" })
  }

  update() {
    // Add repeating floor & city animation
    this.floor.tilePosition.x -= 2
    this.city.tilePosition.x -= 1.3
  }

  goHome() {
    this.game.state.start('Start', true, false);
  }

}
