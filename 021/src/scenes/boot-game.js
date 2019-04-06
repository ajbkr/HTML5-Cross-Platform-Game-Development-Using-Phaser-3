import Phaser from 'phaser'

import gameOptions from '../game-options'

import emptytilePng from '../assets/sprites/emptytile.png'
import tilesPng from '../assets/sprites/tiles.png'

import growMp3 from '../assets/sounds/grow.mp3'
import growOgg from '../assets/sounds/grow.ogg'
import moveMp3 from '../assets/sounds/move.mp3'
import moveOgg from '../assets/sounds/move.ogg'

class BootGame extends Phaser.Scene {
  constructor () {
    super('BootGame')
  }

  preload () {
    this.load.image('emptytile', emptytilePng)

    this.load.spritesheet('tiles', tilesPng, {
      frameHeight: gameOptions.tileSize,
      frameWidth: gameOptions.tileSize
    })

    this.load.audio('move', [moveOgg, moveMp3])
    this.load.audio('grow', [growOgg, growMp3])
  }

  create () {
    this.scene.start('PlayGame')
  }
}

export default BootGame
