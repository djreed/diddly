import { USER_BODY, USER_DIDDLER } from '../utils.js'
import { BITMAPSIZE, DEFAULT_MASS, THRUST_SPEED, ROTATE_SPEED } from '../utils.js'
import { drawCircle, drawTriangle } from '../utils.js'

class Player {
  constructor(game, socket, collisions) {
    this.kills = 0;

    this.game = game;
    this.socket = socket;
    this.collisions = collisions;
    this.id = socket.io.engine.id;

    this.x = this.game.world.randomX;
    this.y = this.game.world.randomY;

    this.setupKeyInput();
    this.generateSprite();
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
    var bmd = drawCircle(this.game, BITMAPSIZE, USER_BODY);

    this.sprite = this.game.add.sprite(this.x, this.y, bmd);
    this.game.physics.p2.enable(this.sprite);

    this.child = this.sprite.addChild(
      this.game.make.sprite(-(BITMAPSIZE * .10), -(BITMAPSIZE * .73),
        drawTriangle(this.game, BITMAPSIZE * .25, USER_DIDDLER))
    );

    this.setCollision();

    this.sprite.id = this.id;
    this.game.camera.follow(this.sprite);
  }

  setCollision() {
    this.sprite.body.setCircle(BITMAPSIZE / 2);
    this.sprite.body.fixedRotation = false;
    this.sprite.body.collideWorldBounds = true;
    this.sprite.body.damping = 0.60;
    this.sprite.body.mass = DEFAULT_MASS;
    this.sprite.body.setCollisionGroup(this.collisions["current"]);
    this.sprite.body.collides(this.collisions["enemies"], this.diddlerCallback, this);
  }

  checkOverlap(spriteA, spriteB) {

    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();

    return Phaser.Rectangle.intersects(boundsA, boundsB);

  }

  diddlerCallback(body1, body2) {
    if (this.checkOverlap(this.child, body2.sprite)) {
      this.kills++;
      this.socket.emit('kill_player', body2.sprite.id);
    }
  }

  toJson() {
    return {
      id: this.id,
      x: this.sprite.x,
      y: this.sprite.y,
      rotation: this.sprite.body.rotation
    };
  }

  update(game){
    this.sprite.body.setZeroRotation();

    //move
    if (this.cursors.up.isDown || this.wasd.up.isDown) { this.thrust(); }
    else if (this.cursors.down.isDown || this.wasd.down.isDown) { this.antithrust(); }
    if (this.cursors.left.isDown || this.wasd.left.isDown) { this.turnLeft(); }
    else if (this.cursors.right.isDown || this.wasd.right.isDown) { this.turnRight(); }

    //game.debug.text('Sprite X: ' + this.sprite.body.x, 16, 50);
    //game.debug.text('Sprite Y: ' + this.sprite.body.y, 16, 65);
    //game.debug.text('X Velocity: ' + this.sprite.body.velocity.x, 16, 80);
    //game.debug.text('Y Velocity: ' + this.sprite.body.velocity.y, 16, 95);
    game.debug.text('Score: ' + this.kills, 16, 70);

    this.socket.emit('move_player', this.toJson());
  }

  thrust() {
    this.sprite.body.thrust(THRUST_SPEED);
  }

  antithrust() {
    this.sprite.body.reverse(THRUST_SPEED);
  }

  turnLeft() {
    this.sprite.body.angularVelocity -= ROTATE_SPEED;
  }

  turnRight() {
    this.sprite.body.angularVelocity += ROTATE_SPEED;
  }
}

export default Player;
