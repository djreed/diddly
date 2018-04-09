import { ENEMY_BODY, ENEMY_DIDDLER, BITMAPSIZE, DEFAULT_MASS, drawCircle, drawTriangle } from '../utils.js'

class Enemy {
    constructor(game, enemy, collisions) {
        this.game = game;
        this.enemy = enemy;
        this.collisions = collisions;
        this.generateSprite();
    }

    generateSprite(){
      var bmd = drawCircle(this.game, BITMAPSIZE, ENEMY_BODY);

      this.sprite = this.game.add.sprite(this.enemy.x, this.enemy.y, bmd);
      this.game.physics.p2.enable(this.sprite);

      this.child = this.sprite.addChild(
        this.game.make.sprite(-(BITMAPSIZE * .10), -(BITMAPSIZE * .73),
          drawTriangle(this.game, BITMAPSIZE * .25, ENEMY_DIDDLER))
      );

      this.setCollision();

      this.sprite.id = this.enemy.id;
      this.sprite.username = this.enemy.username;
      this.sprite.color = this.color;
      this.sprite.body.rotation  = this.enemy.rotation;
    }

    setCollision(){
        this.sprite.body.static = true;
        this.sprite.body.setCircle(BITMAPSIZE / 2);
        this.sprite.body.fixedRotation = false;
        this.sprite.body.dynamic = true;
        this.sprite.body.mass = DEFAULT_MASS;
        this.sprite.body.setCollisionGroup(this.collisions["enemies"]);
        this.sprite.body.collides([this.collisions["current"]]);
    }

    move(enemy){
        if(this.sprite.alive){
            this.sprite.reset(enemy.x, enemy.y);
            this.sprite.body.rotation = enemy.rotation;
        }
    }
}

export default Enemy;
