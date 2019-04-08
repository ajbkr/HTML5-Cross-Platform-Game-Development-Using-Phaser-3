export default {
  aspectRatio: 16 / 9,
  boardSize: {
    cols: 4,
    rows: 4
  },
  localStorageName: 'topscore4096',
  swipeMaxTime: 1000,
  swipeMinDistance: 20,
  swipeMinNormal: 0.85,
  tileSize: 200,
  tileSpacing: 20,
  tweenSpeed: 50
}

const LEFT = 0
const RIGHT = 1
const UP = 2
const DOWN = 3

export const directions = {
  DOWN,
  LEFT,
  RIGHT,
  UP
}
