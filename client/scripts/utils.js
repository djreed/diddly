var ROTATE_SPEED = 5;
var THRUST_SPEED = 5000;
var WIDTH = 20;
var BITMAPSIZE = WIDTH*2;
var DEFAULT_MASS = 10;

function drawTriangle(game, bitmapSize=(WIDTH*4), color) {
  var bmd = game.add.bitmapData(bitmapSize, bitmapSize);
  bmd.ctx.fillStyle = color;
  bmd.ctx.beginPath();
  bmd.ctx.moveTo(0, bitmapSize);
  bmd.ctx.lineTo(bitmapSize/2, 0);
  bmd.ctx.lineTo(bitmapSize, bitmapSize);
  bmd.ctx.closePath();
  bmd.ctx.fill();
  return bmd;
}

function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

var RED = '#FF0000';
var GREEN = '#00FF00';

function drawCircle(game, bitmapSize=WIDTH, color) {
  var bmd = game.add.bitmapData(bitmapSize, bitmapSize);
  bmd.ctx.fillStyle = color;
  bmd.ctx.beginPath();
  bmd.ctx.arc(WIDTH, WIDTH, WIDTH, 0, Math.PI*2, true);
  bmd.ctx.fill();
  return bmd;
}

var USER_BODY = '#000099';
var USER_DIDDLER = '#000099'
var ENEMY_BODY = '#990000';
var ENEMY_DIDDLER = '#990000';

export {
  USER_BODY,
  USER_DIDDLER,
  ENEMY_BODY,
  ENEMY_DIDDLER,
  DEFAULT_MASS,
  WIDTH,
  BITMAPSIZE,
  ROTATE_SPEED,
  THRUST_SPEED,
  drawCircle,
  drawTriangle,
  sleep,
};
