/**
 * Created by connor on 4/7/18.
 */

class Bullet {
  constructor(game, socket, x, y, angle) {
    this.game = game;
    this.socket = socket;
    this.x = x;
    this.y = y;
    this.angle = angle;
  }
}