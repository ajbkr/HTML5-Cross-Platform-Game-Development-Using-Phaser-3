import Phaser from 'phaser'

import { BootGame, PlayGame } from './scenes'

import gameOptions from './game-options'
import makeResizeGame from './make-resize-game'

window.onload = function () {
  const gameConfig = {
    backgroundColor: 0xecf0f1,
    height: gameOptions.boardSize.rows * (gameOptions.tileSize +
      gameOptions.tileSpacing) + gameOptions.tileSpacing,
    scene: [BootGame, PlayGame],
    width: gameOptions.boardSize.cols * (gameOptions.tileSize +
      gameOptions.tileSpacing) + gameOptions.tileSpacing
  }

  const game = new Phaser.Game(gameConfig)
  window.focus()
  const resizeGame = makeResizeGame(game)
  resizeGame()
  window.addEventListener('resize', resizeGame)
}
