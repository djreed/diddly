/**
 * Created by viller_m on 19/05/15.
 */
class Enemy {
    constructor(game, enemy, collisions) {
        this.game = game;
        this.enemy = enemy;
        this.collisions = collisions;
        this.generateSprite();
    }

    generateSprite(){
        var bmd = this.generateCircle();

        this.sprite = this.game.add.sprite(this.enemy.x, this.enemy.y, bmd);
        this.game.physics.p2.enable(this.sprite, false);

        this.setCollision();

        this.sprite.id = this.enemy.id;
        this.sprite.username = this.enemy.username;
        this.sprite.color = '#FF0000';
        this.sprite.health = this.enemy.health;
        this.sprite.speed_base = 5000;
        this.sprite.speed = this.enemy.speed;
        this.sprite.width = this.enemy.width;
        this.sprite.height = this.enemy.height;
    }

    generateCircle(){
        var bitmapSize = this.enemy.health * 2;
        var bmd = this.game.add.bitmapData(bitmapSize, bitmapSize);
        bmd.ctx.fillStyle = '#FF0000';
        bmd.ctx.beginPath();
        bmd.ctx.arc(this.enemy.health, this.enemy.health, this.enemy.health, 0, Math.PI*2, true);
        bmd.ctx.closePath();
        bmd.ctx.fill();
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
    }
}

export default Enemy;