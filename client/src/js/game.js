const gameObj = {
    cursors: undefined,
    gameOver: false,
    phaser: undefined,
    player: undefined,
    playerInfo: {
        map: {
            x: 7,
            y: 7,
        },
        orientation: 'up',
        ring: '',
        shield: 'normal',
        speed: 48,
    },
    walls: undefined,
};

gameObj.phaser = new Phaser.Game({
    backgroundColor: '#fcd8a8',
    height: 240,
    parent: 'game',
    physics: {
        arcade: {
            debug: false,
        },
        default: 'arcade',
    },
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH,
        height: 240,
        mode: Phaser.Scale.FIT,
        parent: 'game',
        width: 256,
    },
    scene: {
        create: createGame,
        preload: preloadGame,
        update: updateGame,
    },
    type: Phaser.AUTO,
    width: 256,
});

const spriteList = [
    'link',
    'rock-walls',
];

function preloadGame() {
    for (const spriteName of spriteList) {
        this.load.spritesheet(spriteName,
            `assets/sprites/${spriteName}.png`,
            {
                frameHeight: 16,
                frameWidth: 16,
            }
        );
    }
}

function createGame() {
    gameObj.cursors = this.input.keyboard.createCursorKeys();
    gameObj.player = this.physics.add.sprite(136, 96 + 64, 'link');
    gameObj.player.setCollideWorldBounds(true);
    gameObj.walls = this.physics.add.staticGroup();

    let animList = [];
    jQuery.ajax({
        async: false,
        dataType: 'json',
        success: function (result) {
            animList = result;
        },
        url: 'assets/anims/link.json',
    });
    for (const anim of animList) {
        this.anims.create({
            key: anim.key,
            frames: this.anims.generateFrameNumbers(anim.sprite, { start: anim.start, end: anim.end }),
            frameRate: anim.frameRate,
            repeat: anim.repeat
        });
    }

    let wallList = [];
    jQuery.ajax({
        async: false,
        dataType: 'json',
        success: function (result) {
            wallList = result;
        },
        url: `assets/maps/${gameObj.playerInfo.map.x}-${gameObj.playerInfo.map.y}.json`,
    });
    for (const wall of wallList) {
        gameObj.walls.create(16 * wall.x + 8, 16 * wall.y + 8 + 64, wall.sprite, wall.frame);
    }

    this.physics.add.collider(gameObj.player, gameObj.walls, hitWall, null, this);
}

function hitWall(player, wall) {
    // this.physics.pause();
    // player.anims.stop();
    // player.setTint(0xff0000);
    // gameObj.gameOver = true;
}

function updateGame() {
    if (gameObj.gameOver) {
        return;
    }

    if (gameObj.cursors.up.isDown) {
        gameObj.player.setVelocityY(-gameObj.playerInfo.speed);
        gameObj.player.anims.play(`link-up-${gameObj.playerInfo.shield}-${gameObj.playerInfo.ring}`, true);
    }
    else if (gameObj.cursors.down.isDown) {
        gameObj.player.setVelocityY(gameObj.playerInfo.speed);
        gameObj.player.anims.play(`link-down-${gameObj.playerInfo.shield}-${gameObj.playerInfo.ring}`, true);
    }
    else {
        gameObj.player.setVelocityY(0);
    }

    if (gameObj.cursors.right.isDown) {
        gameObj.player.setVelocityX(gameObj.playerInfo.speed);
        gameObj.player.anims.play(`link-right-${gameObj.playerInfo.shield}-${gameObj.playerInfo.ring}`, true);
    }
    else if (gameObj.cursors.left.isDown) {
        gameObj.player.setVelocityX(-gameObj.playerInfo.speed);
        gameObj.player.anims.play(`link-left-${gameObj.playerInfo.shield}-${gameObj.playerInfo.ring}`, true);
    }
    else {
        gameObj.player.setVelocityX(0);
    }

    if (gameObj.cursors.up.isUp && gameObj.cursors.down.isUp && gameObj.cursors.right.isUp && gameObj.cursors.left.isUp) {
        gameObj.player.anims.play(`link-down-${gameObj.playerInfo.shield}-${gameObj.playerInfo.ring}`);
    }
}
