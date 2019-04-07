HTML5 Cross Platform Game Development Using Phaser 3
====================================================

Reworked examples from Emanuele Feronato's [HTML5 Cross Platform Game
Development Using Phaser
3](http://phaser.io/shop/books/phaser3-cross-platform-games).

I have modified some of the source code to use ES6/7 and have added linting
using [JavaScript Standard Style](https://standardjs.com/).

I have also added Babel, webpack, et al. for bundling.

Android/Cordova Build
---------------------

Ensure `cordova` has been installed from npm:

```
$ npm install cordova -g # may need sudo
```

To build for Android:

```
$ cd 028 # or 029
$ npm run build
$ npm run copy-dist
$ cd ../cordovafolder
$ cordova prepare
```
