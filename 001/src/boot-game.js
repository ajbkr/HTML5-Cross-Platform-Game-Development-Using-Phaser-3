import Phaser from 'phaser'

import emptytile from './assets/sprites/emptytile.png'

class BootGame extends Phaser.Scene {
  constructor () {
    super('BootGame')
  }

  preload () {
    this.load.image('emptytile', emptytile)
  }

  create () {
    console.log('game is booting...')
    this.scene.start('PlayGame')
  }
}

export default BootGame
