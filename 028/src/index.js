import Phaser from 'phaser'

import { BootGame, PlayGame } from './scenes'

import gameOptions from './game-options'

function onDeviceReady () {
  const { aspectRatio, boardSize, tileSize, tileSpacing } = gameOptions

  const tileAndSpacing = tileSize + tileSpacing
  let width = boardSize.cols * tileAndSpacing
  width += tileSpacing
  const gameConfig = {
    backgroundColor: 0xecf0f1,
    scale: {
      autoCenter: Phaser.Scale.CENTER_BOTH,
      height: width * aspectRatio,
      mode: Phaser.Scale.FIT,
      parent: 'thegame',
      width
    },
    scene: [BootGame, PlayGame]
  }

  // eslint-disable-next-line no-new
  new Phaser.Game(gameConfig)
  window.focus()
}

window.onload = onDeviceReady
document.addEventListener('deviceready', onDeviceReady)
