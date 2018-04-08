/**
 * Created by viller_m on 19/05/15.
 */
class Enemy {
    constructor(game, enemy, collisions) {
        this.game = game;
        this.enemy = enemy;
        this.collisions = collisions;
        this.color = "#FF0000"
        this.generateSprite();
        this.setupWeapon();
    }

    setupWeapon() {
      this.weapon = this.game.add.weapon(30, 'bullet');
      this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
      this.weapon.trackSprite(this.sprite, 30, 0, true);
      this.weapon.bulletSpeed = 200;
      this.weapon.fireRate = 200;
    }

    generateSprite(){
        var bmd = this.generateCircle();

        this.sprite = this.game.add.sprite(this.enemy.x, this.enemy.y, bmd);
        this.game.physics.p2.enable(this.sprite, false);

        this.setCollision();

        this.sprite.id = this.enemy.id;
        this.sprite.username = this.enemy.username;
        this.sprite.color = this.color;
        this.sprite.health = this.enemy.health;
        this.sprite.speed_base = 5000;
        this.sprite.speed = this.enemy.speed;
        this.sprite.width = this.enemy.width;
        this.sprite.height = this.enemy.height;
        this.sprite.body.rotation  = this.enemy.rotation;
    }

    generateCircle(){
      var bitmapSize = this.enemy.health * 2
      var bmd = this.game.add.bitmapData(bitmapSize, bitmapSize);
      bmd.circle(bitmapSize/2, bitmapSize/2, bitmapSize/2, this.color)
      return bmd;
    }

    setCollision(){
        this.sprite.body.static = true;
        this.sprite.body.setCircle(this.sprite.width / 2);
        this.sprite.body.fixedRotation = false;
        this.sprite.body.setCollisionGroup(this.collisions["enemies"]);
        this.sprite.body.collides([this.collisions["current"], this.collisions["bullets"]]);
    }

    move(enemy){
        if(this.sprite.alive){
            this.sprite.kill();
        }
        this.enemy = enemy;
        this.generateSprite();
        this.setupWeapon();
    }

    fireBullet() {
      this.weapon.fire()
    }
}

export default Enemy;
