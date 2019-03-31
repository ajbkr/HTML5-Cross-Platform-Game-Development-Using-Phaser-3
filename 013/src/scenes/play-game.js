import Phaser from 'phaser'

import gameOptions, { directions } from '../game-options'

const { LEFT, RIGHT, UP, DOWN } = directions

class PlayGame extends Phaser.Scene {
  constructor () {
    super('PlayGame')
  }

  addTile () {
    const emptyTiles = []

    for (let y = 0; y < gameOptions.boardSize.rows; ++y) {
      for (let x = 0; x < gameOptions.boardSize.cols; ++x) {
        if (this.boardArray[y][x].tileValue === 0) {
          emptyTiles.push({ col: x, row: y })
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
        const tilePosition = this.getTilePosition(y, x)
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

  getTilePosition (row, col) {
    const { tileSize, tileSpacing } = gameOptions

    const posX = tileSpacing * (col + 1) + tileSize * (col + 0.5)
    const posY = tileSpacing * (row + 1) + tileSize * (row + 0.5)

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
    if (this.canMove) {
      const { swipeMaxTime, swipeMinDistance, swipeMinNormal } = gameOptions

      const swipeTime = e.upTime - e.downTime
      const fastEnough = swipeTime < swipeMaxTime
      const swipe = new Phaser.Geom.Point(e.upX - e.downX, e.upY - e.downY)
      const swipeMagnitude = Phaser.Geom.Point.GetMagnitude(swipe)
      const longEnough = swipeMagnitude > swipeMinDistance

      if (longEnough && fastEnough) {
        Phaser.Geom.Point.SetMagnitude(swipe, 1)

        if (swipe.x > swipeMinNormal) {
          this.makeMove(RIGHT)
        }
        if (swipe.x < -swipeMinNormal) {
          this.makeMove(LEFT)
        }
        if (swipe.y > swipeMinNormal) {
          this.makeMove(DOWN)
        }
        if (swipe.y < -swipeMinNormal) {
          this.makeMove(UP)
        }
      }
    }
  }

  isLegalPosition (row, col) {
    const rowInside = row >= 0 && row < gameOptions.boardSize.rows
    const colInside = col >= 0 && col < gameOptions.boardSize.cols

    return rowInside && colInside
  }

  makeMove (d) {
    const dRow = (d === LEFT || d === RIGHT) ? 0 : d === UP ? -1 : 1
    const dCol = (d === UP || d === DOWN) ? 0 : d === LEFT ? -1 : 1

    this.canMove = false
    let movedTiles = 0

    const firstRow = (d === UP) ? 1 : 0
    const lastRow = gameOptions.boardSize.rows - ((d === DOWN) ? 1 : 0)
    const firstCol = (d === LEFT) ? 1 : 0
    const lastCol = gameOptions.boardSize.cols - ((d === RIGHT) ? 1 : 0)

    for (let y = firstRow; y < lastRow; ++y) {
      for (let x = firstCol; x < lastCol; ++x) {
        let curRow = dRow === 1 ? (lastRow - 1) - y : y
        let curCol = dCol === 1 ? (lastCol - 1) - x : x

        let { tileValue } = this.boardArray[curRow][curCol]

        if (tileValue !== 0) {
          let newRow = curRow
          let newCol = curCol

          while (this.isLegalPosition(newRow + dRow, newCol + dCol)) {
            newRow += dRow
            newCol += dCol
          }

          ++movedTiles
          this.boardArray[curRow][curCol].tileSprite.depth = movedTiles

          let newPos = this.getTilePosition(newRow, newCol)

          this.boardArray[curRow][curCol].tileSprite.x = newPos.x
          this.boardArray[curRow][curCol].tileSprite.y = newPos.y

          this.boardArray[curRow][curCol].tileValue = 0
          if (this.boardArray[newRow][newCol].tileValue === tileValue) {
            ++this.boardArray[newRow][newCol].tileValue
            this.boardArray[curRow][curCol].tileSprite.setFrame(tileValue)
          } else {
            this.boardArray[newRow][newCol].tileValue = tileValue
          }
        }
      }
    }
  }
}

export default PlayGame
