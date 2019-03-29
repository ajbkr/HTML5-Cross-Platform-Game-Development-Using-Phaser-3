import Phaser from 'phaser'

import gameOptions, { constants } from '../game-options'

const { LEFT, RIGHT, UP, DOWN } = constants

class PlayGame extends Phaser.Scene {
  constructor () {
    super('PlayGame')
  }

  addTile () {
    const emptyTiles = []

    for (let y = 0; y < gameOptions.boardSize.rows; ++y) {
      for (let x = 0; x < gameOptions.boardSize.cols; ++x) {
        if (this.boardArray[y][x].tileValue === 0) {
          emptyTiles.push({
            col: x,
            row: y
          })
        }
      }
    }
    if (emptyTiles.length > 0) {
      const { col, row } = Phaser.Utils.Array.GetRandom(emptyTiles)

      this.boardArray[row][col].tileValue = 1
      this.boardArray[row][col].tileSprite.visible = true
      this.boardArray[row][col].tileSprite.setFrame(0)
      this.boardArray[row][col].tileSprite.alpha = 0

      this.tweens.add({
        alpha: 1,
        callbackScope: this,
        duration: gameOptions.tweenSpeed,
        onComplete: function () {
          console.log('tween completed')
          this.canMove = true
        },
        targets: [this.boardArray[row][col].tileSprite]
      })
    }
  }

  create () {
    this.canMove = false
    this.boardArray = []

    for (let y = 0; y < gameOptions.boardSize.rows; ++y) {
      this.boardArray[y] = []

      for (let x = 0; x < gameOptions.boardSize.cols; ++x) {
        const tilePosition = this.getTilePosition(x, y)
        this.add.image(tilePosition.x, tilePosition.y, 'emptytile')
        let tile = this.add.sprite(tilePosition.x, tilePosition.y, 'tiles', 0)
        tile.visible = false
        this.boardArray[y][x] = {
          tileValue: 0,
          tileSprite: tile
        }
      }
    }
    this.addTile()
    this.addTile()

    this.input.keyboard.on('keydown', this.handleKey, this)
    this.input.on('pointerup', this.handleSwipe, this)
  }

  getTilePosition (col, row) {
    const posX = gameOptions.tileSpacing * (col + 1) + gameOptions.tileSize * (col + 0.5)
    const posY = gameOptions.tileSpacing * (row + 1) + gameOptions.tileSize * (row + 0.5)
    return new Phaser.Geom.Point(posX, posY)
  }

  handleKey (e) {
    if (this.canMove) {
      switch (e.code) {
        case 'KeyA':
        case 'ArrowLeft':
          this.makeMove(LEFT)
          break
        case 'KeyD':
        case 'ArrowRight':
          this.makeMove(RIGHT)
          break
        case 'KeyW':
        case 'ArrowUp':
          this.makeMove(UP)
          break
        case 'KeyS':
        case 'ArrowDown':
          this.makeMove(DOWN)
          break
      }
    }
  }

  handleSwipe (e) {
    const swipeTime = e.upTime - e.downTime
    const swipe = new Phaser.Geom.Point(e.upX - e.downX, e.upY - e.downY)

    console.log(`Movement time: ${swipeTime}ms`)
    console.log(`Horizontal distance: ${swipe.x} pixels`)
    console.log(`Vertical distance: ${swipe.y} pixels`)
  }

  makeMove (d) {
    console.log('about to move')
  }
}

export default PlayGame
