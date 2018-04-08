'use strict';

class Preload {
    preload(game) {

        // Add preload sprite
        var tmpPreload = this.game.cache.getImage('preloader');
        this.loadingSprite = this.add.sprite(
            (game.width - tmpPreload.width) / 2,
            (game.height - tmpPreload.height) / 2,
            'preloader'
        );

        // run preload sprite
        this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
        this.load.setPreloadSprite(this.loadingSprite);

        // Load game assets here
        this.load.image('logo', 'assets/logo.png');
        this.load.image('forest', 'assets/forest.png');
        this.load.tilemap('forest-arena', 'assets/arena3.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('forestTiles', 'assets/forest_tiles.png');

        game.time.advancedTiming = true;
    }

    onLoadComplete() {
        this.game.state.start('game', true, false);
    }
}

export default Preload;
