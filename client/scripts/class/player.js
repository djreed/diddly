/**
 * Created by viller_m on 19/05/15.
 */
class Player {
  constructor(game, socket, collisions) {
    this.SPRITE_MOVE_FACTOR = 50;

    this.game = game;
    this.socket = socket;
    this.collisions = collisions;
    this.id = socket.io.engine.id;
    this.color = '#00FF00';
    this.health = 20;
    this.speed = 5;

    this.x = this.game.world.randomX;
    this.y = this.game.world.randomY;

    this.setupKeyInput();
    this.generateSprite();
    this.setupWeapon();
  }

  setupKeyInput() {
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.wasd = {
      up: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
      down: this.game.input.keyboard.addKey(Phaser.Keyboard.S),
      left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
      right: this.game.input.keyboard.addKey(Phaser.Keyboard.D)
    };
  }

  generateSprite(){
    var bmd = this.generateCircle(this.color);

    this.sprite = this.game.add.sprite(this.x, this.y, bmd);
    this.game.physics.p2.enable(this.sprite);

    this.setCollision();

    this.sprite.id = this.id;
    this.sprite.color = this.color;
    this.sprite.health = this.health;
    this.sprite.speed = this.speed;

    this.game.camera.follow(this.sprite);
  }

  generateCircle(){
    var bitmapSize = this.health * 2
    var bmd = this.game.add.bitmapData(bitmapSize, bitmapSize);
    bmd.ctx.fillStyle = this.color;
    bmd.ctx.beginPath();
    bmd.ctx.moveTo(0, 0);
    bmd.ctx.lineTo(bitmapSize, bitmapSize/2);
    bmd.ctx.lineTo(0, bitmapSize);
    bmd.ctx.closePath();
    bmd.ctx.fill();
    return bmd;
  }

  setupWeapon() {
    this.weapon = this.game.add.weapon(30, 'bullet');
    this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    this.weapon.trackSprite(this.sprite, 30, 0, true);
    this.weapon.bulletSpeed = 200;
    this.weapon.fireRate = 200;
    this.weapon.setBulletFrames(0,80, true);
  }

  setCollision() {
    this.sprite.body.setCircle(this.sprite.width / 2);
    this.sprite.body.fixedRotation = false;
    this.sprite.body.collideWorldBounds = true;
    this.sprite.body.setCollisionGroup(this.collisions["current"]);
    this.sprite.body.collides(this.collisions["enemies"])
    this.sprite.body.collides(this.collisions["bullets"], this.bulletsCallback, this);
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
      health: this.sprite.health,
      x: this.sprite.x,
      y: this.sprite.y,
      rotation: this.sprite.body.rotation,
      height: this.sprite.height,
      width: this.sprite.width
    };
  }

  update(game){
    if (this.game.input.activePointer.isDown) {
      this.fireBullet();
      this.socket.emit('fire_bullet', this.id);
    }

    // update rotation
    this.sprite.body.rotation = game.physics.arcade.angleToPointer(this.sprite);

    this.sprite.body.setZeroVelocity();

    //move
    if (this.cursors.up.isDown || this.wasd.up.isDown) { this.moveUp(); }
    else if (this.cursors.down.isDown || this.wasd.down.isDown) { this.moveDown(); }
    if (this.cursors.left.isDown || this.wasd.left.isDown) { this.moveLeft(); }
    else if (this.cursors.right.isDown || this.wasd.right.isDown) { this.moveRight(); }

    game.debug.text('speed: ' + this.sprite.speed, 32, 120);

    this.socket.emit('move_player', this.toJson());
  }

  fireBullet() {
    this.weapon.fire()
  }

  moveUp() {
    this.y -= this.speed;
    this.sprite.body.moveUp(this.speed * this.SPRITE_MOVE_FACTOR);
  }

  moveDown() {
    this.y += this.speed;
    this.sprite.body.moveDown(this.speed * this.SPRITE_MOVE_FACTOR);
  }

  moveLeft() {
    this.x -= this.speed;
    this.sprite.body.moveLeft(this.speed * this.SPRITE_MOVE_FACTOR);
  }

  moveRight() {
    this.x += this.speed;
    this.sprite.body.moveRight(this.speed * this.SPRITE_MOVE_FACTOR);
  }
}

export default Player;
