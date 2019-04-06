import Phaser from 'phaser'

import gameOptions from '../game-options'

import emptytilePng from '../assets/sprites/emptytile.png'
import gametitlePng from '../assets/sprites/gametitle.png'
import howtoplayPng from '../assets/sprites/howtoplay.png'
import logoPng from '../assets/sprites/logo.png'
import restartPng from '../assets/sprites/restart.png'
import scorepanelPng from '../assets/sprites/scorepanel.png'
import scorelabelsPng from '../assets/sprites/scorelabels.png'
import tilesPng from '../assets/sprites/tiles.png'

import growMp3 from '../assets/sounds/grow.mp3'
import growOgg from '../assets/sounds/grow.ogg'
import moveMp3 from '../assets/sounds/move.mp3'
import moveOgg from '../assets/sounds/move.ogg'

class BootGame extends Phaser.Scene {
  constructor () {
    super('BootGame')
  }

  preload () {
    const { tileSize } = gameOptions

    this.load.image('emptytile', emptytilePng)
    this.load.image('gametitle', gametitlePng)
    this.load.image('howtoplay', howtoplayPng)
    this.load.image('logo', logoPng)
    this.load.image('scorepanel', scorepanelPng)
    this.load.image('scorelabels', scorelabelsPng)
    this.load.image('restart', restartPng)

    this.load.spritesheet('tiles', tilesPng, {
      frameHeight: tileSize,
      frameWidth: tileSize
    })

    this.load.audio('move', [moveOgg, moveMp3])
    this.load.audio('grow', [growOgg, growMp3])
  }

  create () {
    this.scene.start('PlayGame')
  }
}

export default BootGame
