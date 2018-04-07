/**
 * Created by viller_m on 19/05/15.
 */
class Bullets {
    constructor(game, bullet, groupCollision, groupParticles) {
        this.game = game;
        this.particule = particule;
        this.groupCollision = groupCollision;
        this.groupBullets = groupParticles;
        this.generateSprite();
    }

    generateSprite(){
        var bmd = this.generateCircle(this.particule.color);

        this.sprite = this.game.add.sprite(this.particule.x, this.particule.y, bmd);
        this.game.physics.p2.enable(this.sprite, false);

        this.setCollision();

        this.sprite.id = this.particule.id;
        this.sprite.mass = this.particule.mass;
    }

    generateCircle(color){
        var bmd = this.game.add.bitmapData(20,20);
        bmd.ctx.fillStyle = color;
        bmd.ctx.beginPath();
        bmd.ctx.arc(10, 10, 10, 0, Math.PI*2, true);
        bmd.ctx.closePath();
        bmd.ctx.fill();
        return bmd;
    }

    setCollision(){
        this.sprite.body.static = true;
        this.sprite.body.setCircle(this.sprite.width / 2);
        this.sprite.body.fixedRotation = false;
        this.sprite.body.setCollisionGroup(this.groupCollision[2]);
        this.sprite.body.collides([this.groupCollision[0], this.groupCollision[1]]);
    }

    move(bullet){
        if(this.sprite.alive){
            this.sprite.kill();
        }
        this.bullet = bullet;
        this.generateSprite();
    }
}

export default Bullets;