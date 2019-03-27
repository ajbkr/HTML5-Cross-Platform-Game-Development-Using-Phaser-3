import Phaser from 'phaser'

import gameOptions from '../game-options'

class PlayGame extends Phaser.Scene {
  constructor () {
    super('PlayGame')
  }

  create () {
    for (let y = 0; y < gameOptions.boardSize.rows; ++y) {
      for (let x = 0; x < gameOptions.boardSize.cols; ++x) {
        const tilePosition = this.getTilePosition(x, y)
        this.add.image(tilePosition.x, tilePosition.y, 'emptytile')
        this.add.sprite(tilePosition.x, tilePosition.y, 'tiles', 0)
      }
    }
  }

  getTilePosition (col, row) {
    const posX = gameOptions.tileSpacing * (col + 1) + gameOptions.tileSize * (col + 0.5)
    const posY = gameOptions.tileSpacing * (row + 1) + gameOptions.tileSize * (row + 0.5)
    return new Phaser.Geom.Point(posX, posY)
  }
}

export default PlayGame
