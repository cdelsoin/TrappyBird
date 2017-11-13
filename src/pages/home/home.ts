import { Component } from '@angular/core'
import { NavController } from 'ionic-angular'
import { GamePage } from '../game/game';

// import pixi, p2 and phaser ce
import "pixi"
import "p2"
import * as Phaser from "phaser-ce"

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  game: Phaser.Game
  stage: Phaser.Stage
  trappy: Phaser.Sprite
  city: Phaser.Sprite
  banner: Phaser.Sprite
  button: any
  floor: any
  nav: any = this.navCtrl

  constructor(public navCtrl: NavController) {
      this.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'content', { create: this.create, preload: this.preload, update: this.update })
      this.game["homepage"] = this
      console.log('megathis', this, this.game)
  }

  preload() {

    this.game.load.image('background', 'assets/stage/background-night-2x.png')
    this.game.load.image('floor', 'assets/stage/floor-night.png')
    this.game.load.image('banner', 'assets/sprite/trappy-lockup.png')
    this.game.load.image('button', 'assets/buttons/start.png')


    this.game.load.spritesheet('trappysheet', 'assets/sprite/trappy-spritesheet.png', 162, 174)
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
    this.banner = this.game.add.sprite(this.game.world.centerX, window.innerHeight-550, 'banner')
    this.button = this.game.add.sprite(this.game.world.centerX, window.innerHeight-300, 'button')
    this.button["homepage"] = HomePage
    // this.button.prototype = Object.create(Phaser.Sprite.prototype)
    // this.button.constructor = this.button
    // add the Trappy Spritesheet
    this.trappy = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY-100, 'trappysheet')
    // name the animation
    this.trappy.animations.add('flap')

    // play the animation .play(name, fps, loop?)
    this.trappy.animations.play('flap', 10, true)

    // Resize Trappy
    this.trappy.scale.x = 0.4
    this.trappy.scale.y = 0.4

    // Resize city background to fit screen
    this.city.scale.x = 0.3
    this.city.scale.y = 0.3

    this.banner.scale.x = 0.4
    this.banner.scale.y = 0.4

    this.button.scale.x = 0.4
    this.button.scale.y = 0.4

    this.banner.anchor.setTo(0.5, 0.5)
    this.trappy.anchor.setTo(0.5, 0.5)
    this.button.anchor.setTo(0.5, 0.5)


    // Add physics to Trappy
    // Needed for: movements, gravity, collisions, etc.
    this.game.physics.arcade.enable(this.trappy)

    // Add gravity to the Trappy to make it fall
    // this.trappy.body.gravity.y = 1400
    // this.game.physics.arcade.enable(this.button)
    this.button.inputEnabled = true
    this.button.events.onInputDown.add(HomePage.prototype.startGame, HomePage)
  }

  update() {

    // Add repeating floor animation
    this.floor.tilePosition.x -= 2

  }

  startGame() {
    console.log(HomePage.prototype,)
    this.navCtrl.push('GamePage');
  }

}
