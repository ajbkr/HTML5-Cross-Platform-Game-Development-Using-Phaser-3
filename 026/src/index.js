import Phaser from 'phaser'

import { BootGame, PlayGame } from './scenes'

import gameOptions from './game-options'
import makeResizeGame from './make-resize-game'

window.onload = function () {
  const { aspectRatio, boardSize, tileSize, tileSpacing } = gameOptions

  const tileAndSpacing = tileSize + tileSpacing
  let width = boardSize.cols * tileAndSpacing
  width += tileSpacing
  const gameConfig = {
    backgroundColor: 0xecf0f1,
    height: width * aspectRatio,
    scene: [BootGame, PlayGame],
    width
  }

  const game = new Phaser.Game(gameConfig)
  window.focus()
  const resizeGame = makeResizeGame(game)
  resizeGame()
  window.addEventListener('resize', resizeGame)
}
