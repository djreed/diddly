'use strict';

import Enemy from '../class/enemy.js';
import Player from '../class/player.js';
import { sleep } from '../utils.js';

class Game {

    create(game) {
        this.socket = io.connect(window.location.host);
        this.players = [];

        var WIDTH = 1280;
        var HEIGHT = 960;
        var RED = '#FF0000';
        var GREEN = '#00FF00';
        var GREY = '#555555';

        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.setImpactEvents(true);
        game.physics.p2.restitution = 0.8;

        game.stage.backgroundColor = '#FFFFFF';
        game.world.setBounds(0, 0, WIDTH, HEIGHT);

        game.add.image(0, 0, 'arena');

        game.camera.bounds.setTo(-game.width/2, -game.height/2, game.world.width + game.width, game.world.height + game.height);

        var groupPlayer = game.physics.p2.createCollisionGroup();
        var groupEnemies = game.physics.p2.createCollisionGroup();
        this.collisionGroups = { current: groupPlayer, enemies: groupEnemies };
        game.physics.p2.updateBoundsCollisionGroup();

        game.stage.disableVisibilityChange = true;

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
            this.socket.on('move_player'  , (enemy) => {
                if(this.players[enemy.id]){
                    this.players[enemy.id].move(enemy);
                }
            });

            // this player was diddled
            this.socket.on('kill_player', (user_id) => {
              if (this.player.id == user_id) {
                    this.player.sprite.kill();
                    this.player.x = game.world.randomX;
                    this.player.y = game.world.randomY;
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
            this.player.update(game);
        }
    }
}

export default Game;
