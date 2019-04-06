import Phaser from 'phaser'

import gameOptions, { directions } from '../game-options'

const { LEFT, RIGHT, UP, DOWN } = directions

class PlayGame extends Phaser.Scene {
  constructor () {
    super('PlayGame')
  }

  create () {
    const restartXY = this.getTilePosition(-0.8, gameOptions.boardSize.cols - 1)
    const restartButton = this.add.sprite(restartXY.x, restartXY.y, 'restart')

    const scoreXY = this.getTilePosition(-0.8, 1)
    this.add.image(scoreXY.x, scoreXY.y, 'scorepanel')
    this.add.image(scoreXY.x, scoreXY.y - 70, 'scorelabels')

    const gameTitle = this.add.image(10, 5, 'gametitle')
    gameTitle.setOrigin(0, 0)

    const howTo = this.add.image(this.game.config.width, 5, 'howtoplay')
    howTo.setOrigin(1, 0)

    const logo = this.add.sprite(this.game.config.width / 2, this.game.config.height, 'logo')
    logo.setOrigin(0.5, 1)

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
          tileSprite: tile,
          upgraded: false
        }
      }
    }

    this.addTile()
    this.addTile()

    this.input.keyboard.on('keydown', this.handleKey, this)
    this.input.on('pointerup', this.handleSwipe, this)

    this.moveSound = this.sound.add('move')
    this.growSound = this.sound.add('grow')
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

  endTween (tile) {
    --this.movingTiles
    tile.depth = 0

    if (this.movingTiles === 0) {
      this.refreshBoard()
    }
  }

  getTilePosition (row, col) {
    const { boardSize, tileSize, tileSpacing } = gameOptions

    const posX = tileSpacing * (col + 1) + tileSize * (col + 0.5)
    let posY = tileSpacing * (row + 1) + tileSize * (row + 0.5)

    let boardHeight = boardSize.rows * tileSize
    boardHeight += (boardSize.rows + 1) * tileSpacing
    const offsetY = (this.game.config.height - boardHeight) / 2
    posY += offsetY

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

  isLegalPosition (row, col, value) {
    const rowInside = row >= 0 && row < gameOptions.boardSize.rows
    const colInside = col >= 0 && col < gameOptions.boardSize.cols

    if (!rowInside || !colInside) {
      return false
    }

    const emptySpot = this.boardArray[row][col].tileValue === 0
    const sameValue = this.boardArray[row][col].tileValue === value
    const alreadyUpgraded = this.boardArray[row][col].upgraded

    return emptySpot || (sameValue && !alreadyUpgraded)
  }

  makeMove (d) {
    this.movingTiles = 0

    const dRow = (d === LEFT || d === RIGHT) ? 0 : d === UP ? -1 : 1
    const dCol = (d === UP || d === DOWN) ? 0 : d === LEFT ? -1 : 1

    this.canMove = false

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

          while (this.isLegalPosition(newRow + dRow, newCol + dCol, tileValue)) {
            newRow += dRow
            newCol += dCol
          }

          if (newRow !== curRow || newCol !== curCol) {
            let newPos = this.getTilePosition(newRow, newCol)

            const willUpdate = this.boardArray[newRow][newCol].tileValue === tileValue

            this.moveTile(this.boardArray[curRow][curCol].tileSprite, newPos, willUpdate)

            this.boardArray[curRow][curCol].tileValue = 0

            if (willUpdate) {
              ++this.boardArray[newRow][newCol].tileValue
              this.boardArray[newRow][newCol].upgraded = true
            } else {
              this.boardArray[newRow][newCol].tileValue = tileValue
            }
          }
        }
      }
    }

    if (this.movingTiles === 0) {
      this.canMove = true
    } else {
      this.moveSound.play()
    }
  }

  moveTile (tile, point, upgrade) {
    const { tileSize, tweenSpeed } = gameOptions
    const { x, y } = point

    ++this.movingTiles
    tile.depth = this.movingTiles
    const distance = Math.abs(tile.x - x) + Math.abs(tile.y - y)

    this.tweens.add({
      callbackScope: this,
      duration: tweenSpeed * distance / tileSize,
      onComplete: function () {
        if (upgrade) {
          this.upgradeTile(tile)
        } else {
          this.endTween(tile)
        }
      },
      targets: [tile],
      x,
      y
    })
  }

  refreshBoard () {
    const { cols, rows } = gameOptions.boardSize

    for (let y = 0; y < rows; ++y) {
      for (let x = 0; x < cols; ++x) {
        const spritePosition = this.getTilePosition(y, x)

        this.boardArray[y][x].tileSprite.x = spritePosition.x
        this.boardArray[y][x].tileSprite.y = spritePosition.y

        const { tileValue } = this.boardArray[y][x]

        if (tileValue > 0) {
          this.boardArray[y][x].tileSprite.visible = true
          this.boardArray[y][x].tileSprite.setFrame(tileValue - 1)
          this.boardArray[y][x].upgraded = false
        } else {
          this.boardArray[y][x].tileSprite.visible = false
        }
      }
    }

    this.addTile()
  }

  upgradeTile (tile) {
    this.growSound.play()

    tile.setFrame(tile.frame.name + 1)

    this.tweens.add({
      callbackScope: this,
      duration: gameOptions.tweenSpeed,
      onComplete: function () {
        this.endTween(tile)
      },
      repeat: 1,
      scaleX: 1.1,
      scaleY: 1.1,
      targets: [tile],
      yoyo: true
    })
  }
}

export default PlayGame
