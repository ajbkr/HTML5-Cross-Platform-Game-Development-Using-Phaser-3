import Phaser from 'phaser'

import gameOptions from '../game-options'

import emptytile from '../assets/sprites/emptytile.png'
import tiles from '../assets/sprites/tiles.png'

class BootGame extends Phaser.Scene {
  constructor () {
    super('BootGame')
  }

  preload () {
    this.load.image('emptytile', emptytile)

    this.load.spritesheet('tiles', tiles, {
      frameHeight: gameOptions.tileSize,
      frameWidth: gameOptions.tileSize
    })
  }

  create () {
    this.scene.start('PlayGame')
  }
}

export default BootGame
