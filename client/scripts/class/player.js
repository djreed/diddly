/**
 * Created by viller_m on 19/05/15.
 */
class Player {
  constructor(game, socket, groupCollision) {
    this.game = game;
    this.socket = socket;
    this.groupCollision = groupCollision;

    this.id = socket.io.engine.id;
    this.color = '#0000FF';
    this.mass = 20;
    this.speed = 100;
    this.x = this.game.world.randomX;
    this.y = this.game.world.randomY;

    this.cursors = game.input.keyboard.createCursorKeys();
    this.wasd = {
      up: game.input.keyboard.addKey(Phaser.Keyboard.W),
      down: game.input.keyboard.addKey(Phaser.Keyboard.S),
      left: game.input.keyboard.addKey(Phaser.Keyboard.A),
      right: game.input.keyboard.addKey(Phaser.Keyboard.D)
    };
    this.generateSprite();
  }

  generateSprite(){
      var bmd = this.generateCircle(this.color);

      this.sprite = this.game.add.sprite(this.x, this.y, bmd);
      this.game.physics.p2.enable(this.sprite, false);

      this.setCollision();

      this.sprite.id = this.id;
      this.sprite.color = this.color;
      this.sprite.mass = this.mass;
      this.sprite.speed = this.speed / this.mass;

      this.game.camera.follow(this.sprite);
  }

  generateCircle(){
    var bitmapSize = this.mass * 2
    var bmd = this.game.add.bitmapData(bitmapSize, bitmapSize);
    bmd.ctx.fillStyle = this.color;
    bmd.ctx.beginPath();
    bmd.ctx.arc(this.mass, this.mass, this.mass, 0, Math.PI*2, true);
    bmd.ctx.closePath();
    bmd.ctx.fill();
    return bmd;
  }

  setCollision() {
    this.sprite.body.setCircle(this.sprite.width / 2);
    this.sprite.body.fixedRotation = false;
    this.sprite.body.setCollisionGroup(this.groupCollision[0]);
    this.sprite.body.collides(this.groupCollision[2], this.bulletsCallback, this);
  }

  bulletsCallback(body1, body2) {
    this.sprite.kill();
    body2.sprite.kill();
    this.socket.emit('kill_player', this.toJson())
  }
  
  toJson() {
    return {
      id: this.sprite.id,
      username: this.sprite.username,
      speed: this.sprite.speed,
      mass: this.sprite.mass,
      color: this.sprite.color,
      x: this.sprite.x,
      y: this.sprite.y,
      height: this.sprite.height,
      width: this.sprite.width
    };
  }

  update(game){
    if (this.cursors.up.isDown || this.wasd.up.isDown) { if (this.y - this.sprite.speed > 0) { this.y -= this.sprite.speed; } }
    else if (this.cursors.down.isDown || this.wasd.down.isDown) { if (this.y + this.sprite.speed < this.game.world.height) { this.y += this.sprite.speed; } }
    if (this.cursors.left.isDown || this.wasd.left.isDown) { if (this.x - this.sprite.speed > 0) { this.x -= this.sprite.speed; } }
    else if (this.cursors.right.isDown || this.wasd.right.isDown) { if (this.x + this.sprite.speed < this.game.world.width) { this.x += this.sprite.speed; } }

    game.debug.text('speed: ' + this.sprite.speed, 32, 120);
    game.debug.text(this.sprite.mass, this.sprite.x - game.camera.x - 10, this.sprite.y - game.camera.y+ 5);

    this.sprite.kill();
    this.generateSprite();

    this.socket.emit('move_player', this.toJson());
  }
}

export default Player;