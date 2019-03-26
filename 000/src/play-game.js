import Phaser from 'phaser'

class PlayGame extends Phaser.Scene {
  constructor () {
    super('PlayGame')
  }

  create () {
    console.log('this is my awesome game')
  }
}

export default PlayGame
