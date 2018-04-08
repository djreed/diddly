'use strict';

import Enemy from 'scripts/class/enemy';
import Player from 'scripts/class/player';
//import Bullets from 'scripts/class/bullets';

class Game {

    create(game) {
        this.socket = io.connect(window.location.host);
        this.players = [];
        this.bullets = [];
        this.weapons = [];
        game.load.spritesheet('bullet', 'assets/sprites/rgblaser.png', 4, 4);

        var WIDTH = 1280;
        var HEIGHT = 960;
        var WHITE = '#FFFFFF';
        var BLACK = '#000000';
        var RED = '#FF0000';
        var GREEN = '#00FF00';
        var GREY = '#555555';

        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.setImpactEvents(true);
        game.physics.p2.restitution = 0.8;

        game.stage.backgroundColor = '#FFFFFF';

        game.world.setBounds(0, 0, WIDTH, HEIGHT);

        //game.add.image(0, 0, 'forest');

        this.map = this.game.add.tilemap('forest-arena');
 
        //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
        this.map.addTilesetImage('forest', 'forestTiles');
     
        //create layer
        this.backgroundlayer = this.map.createLayer('backgroundLayer');
        this.blockedLayer = this.map.createLayer('blockedLayer');
     
        //collision on blockedLayer
        this.map.setCollisionBetween(1, 10000, true, this.blockedLayer);
        this.backgroundlayer.resizeWorld();

        game.camera.bounds.setTo(-game.width/2, -game.height/2, game.world.width + game.width, game.world.height + game.height);

        var groupPlayer = game.physics.p2.createCollisionGroup();
        var groupEnemies = game.physics.p2.createCollisionGroup();
        var groupBullet = game.physics.p2.createCollisionGroup();

        this.collisionGroups = { current: groupPlayer, enemies: groupEnemies, bullets: groupBullet};

        game.physics.p2.updateBoundsCollisionGroup();

        this.groupBullets = game.add.group();
        this.groupBullets.enableBody = true;
        this.groupBullets.physicsBodyType = Phaser.Physics.P2JS;

        this.setEventHandlers(game);
    }

    setEventHandlers(game){
        this.socket.on('connect', () => {
            this.player = new Player(game, this.socket, this.collisionGroups);
            this.socket.emit('new_player', this.player.toJson());

            // new player
            this.socket.on('new_player', (enemy) => {
                this.players[enemy.id] = new Enemy(game, enemy, this.collisionGroups);
            });

            // Player
            this.socket.on('move_player', (enemy) => {
                if(this.players[enemy.id]){
                    this.players[enemy.id].move(enemy);
                }
            });
            
            this.socket.on('fire_bullet', (bullet) => {
                this.bullets.push(bullet);
                console.log(this.bullets)
            });

            this.socket.on('kill_player', (user) => {
                if(this.player.id == user.id) {
                    this.player.sprite.kill();
                    this.player.x = game.world.randomX;
                    this.player.y = game.world.randomY;
                    this.player.health = 20;
                    this.player.generateSprite();
                }
            });

            this.socket.on('logout', (id) => {
                this.players[id].sprite.kill();
                delete this.players[id];
            });
        });
    }

    update(game) {
        if (this.player) {
            this.player.update(game, this.blockedLayer);
        }

        game.debug.cameraInfo(game.camera, 32, 32);

        //game.world.scale.set(1);
    }
}

export default Game;
