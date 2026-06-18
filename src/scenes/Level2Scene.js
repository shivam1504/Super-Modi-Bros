// import { createTilemapLayers, createCollectiblesFromTilemap } from '../utils/tilemap-loader.js';

// class Level2Scene extends Phaser.Scene {
//     constructor() {
//         super({ key: 'Level2Scene' });
//     }

//     preload() {
//         // Load tilemap assets
//         this.load.tilemapTiledJSON('rssMap', 'assets/tilemaps/rss-journey.json');
//         this.load.image('tileset', 'assets/tilemaps/tileset.png');

//         // Load player and game assets
//         this.load.image('player', 'assets/sprites/modi-player.png');
//         this.load.image('platform', 'assets/sprites/platforms.png');
//         this.load.image('rssBadge', 'assets/sprites/rss-badge.png');
//         this.load.image('enemy-vendor', 'assets/sprites/vendor.png');

//         // Load sounds
//         this.load.audio('jump', 'assets/sounds/jump.mp3');
//         this.load.audio('collect', 'assets/sounds/collect.mp3');
//         this.load.audio('background', 'assets/sounds/rss-bg.mp3');
//     }

//     create() {
//         // === CREATE TILEMAP LAYERS ===
//         const layerConfig = [
//             { name: 'Ground', collides: true },
//             { name: 'Platforms', collides: true },
//             { name: 'Background', collides: false },
//             { name: 'Decorations', collides: false }
//         ];

//         const layers = createTilemapLayers(
//             this,
//             'rssMap',
//             'tileset',
//             layerConfig
//         );

//         // === CREATE PLAYER (Modi as young RSS volunteer) ===
//         this.player = this.physics.add.sprite(100, 300, 'player');
//         this.player.setBounce(0.1);
//         this.player.setCollideWorldBounds(true);
//         this.player.body.setDrag(100, 0);
//         this.player.body.setMaxVelocity(300, 600);
//         this.player.setDisplaySize(40, 60);

//         // Collide player with ground
//         this.physics.add.collider(this.player, layers.Ground);
//         this.physics.add.collider(this.player, layers.Platforms);

//         // === CREATE COLLECTIBLES (RSS Badges) ===
//         this.rssBadges = this.physics.add.group();

//         // Create 20 RSS badges across the level
//         for (let i = 0; i < 20; i++) {
//             const x = 150 + i * 40;
//             const y = 200 + (i % 3) * 50; // Alternate heights
//             const badge = this.rssBadges.create(x, y, 'rssBadge');
//             badge.setBounceY(0.3);
//             badge.setDisplaySize(30, 30);
//         }

//         // Collide badges with ground
//         this.physics.add.collider(this.rssBadges, layers.Ground);

//         // === CREATE ENEMIES (Opposition Politicians) ===
//         this.enemies = this.physics.add.group();

//         // Create 5 enemies
//         for (let i = 0; i < 5; i++) {
//             const enemy = this.enemies.create(600 + i * 100, 450, 'enemy-vendor');
//             enemy.setVelocityX(100);
//             enemy.setCollideWorldBounds(true);
//             enemy.setDisplaySize(40, 50);
//         }

//         // Enemy collision with ground
//         this.physics.add.collider(this.enemies, layers.Ground);

//         // === SCORE SYSTEM ===
//         this.score = 0;
//         this.scoreText = this.add.text(16, 16, 'RSS Badges: 0', {
//             fontSize: '24px',
//             fill: '#fff'
//         });

//         // === LEVEL TITLE ===
//         this.add.text(300, 30, 'LEVEL 2: RSS Pracharak Path', {
//             fontSize: '32px',
//             fill: '#fff',
//             fontStyle: 'bold'
//         });

//         // === CONTROLS HINT ===
//         this.add.text(300, 550, '← → Move | ↑ Jump | Collect RSS Badges', {
//             fontSize: '18px',
//             fill: '#aaa'
//         });

//         // === SOUND SYSTEM ===
//         this.backgroundMusic = this.sound.play('background', { loop: true });

//         // === CONTROLS ===
//         this.cursors = this.input.keyboard.createCursorKeys();

//         // === ANIMATIONS ===
//         this.createAnimations();

//         // === COLLECTIBLE OVERLAP ===
//         this.physics.add.overlap(this.player, this.rssBadges, (player, badge) => {
//             badge.disableBody(true, true);
//             this.score += 1;
//             this.scoreText.setText('RSS Badges: ' + this.score);

//             // Play collect sound
//             this.sound.play('collect');

//             // Particle effect
//             this.createCollectParticle(badge.x, badge.y);
//         });

//         // === ENEMY COLLISION ===
//         this.physics.add.collider(this.player, this.enemies, (player, enemy) => {
//             if (player.isInvincible) {
//                 enemy.disableBody(true, true);
//                 this.score += 10;
//                 this.scoreText.setText('RSS Badges: ' + this.score);
//             } else {
//                 enemy.setVelocityX(-enemy.body.velocity.x);
//                 player.setTint(0xff0000);
//                 this.score -= 5;
//                 this.scoreText.setText('RSS Badges: ' + this.score);
//             }
//         });

//         // === LEVEL EXIT (Next Level Door) ===
//         this.levelExit = this.add.image(750, 500, 'platform');
//         this.levelExit.setDisplaySize(60, 60);

//         this.physics.add.overlap(this.player, this.levelExit, () => {
//             if (this.score >= 15) {
//                 this.scene.start('Level3Scene'); // Next level
//             } else {
//                 // Show message: Need more badges
//                 this.showMessage('Need 15 RSS Badges to continue!');
//             }
//         });
//     }

//     createAnimations() {
//         // Player walk animations
//         this.anims.create({
//             key: 'left',
//             frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
//             frameRate: 10,
//             repeat: -1
//         });

//         this.anims.create({
//             key: 'right',
//             frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
//             frameRate: 10,
//             repeat: -1
//         });

//         this.anims.create({
//             key: 'turn',
//             frames: this.anims.generateFrameNumbers('player', { start: 4, end: 4 }),
//             frameRate: 10,
//             repeat: 0
//         });
//     }

//     createCollectParticle(x, y) {
//         const particles = this.add.particles(x, y, 'rssBadge', {
//             speed: 100,
//             scale: { start: 1, end: 0 },
//             blendMode: 'SCREEN',
//             quantity: 10
//         });

//         particles.destroy(500);
//     }

//     showMessage(message) {
//         const msg = this.add.text(300, 300, message, {
//             fontSize: '28px',
//             fill: '#ff0000',
//             fontStyle: 'bold',
//             backgroundColor: '#000'
//         });

//         this.time.delayedCall(2000, () => {
//             msg.destroy();
//         });
//     }

//     update() {
//         // === PLAYER MOVEMENT ===
//         if (this.cursors.left.isDown) {
//             this.player.setVelocityX(-200);
//             this.player.anims.play('left', true);
//         } else if (this.cursors.right.isDown) {
//             this.player.setVelocityX(200);
//             this.player.anims.play('right', true);
//         } else {
//             this.player.setVelocityX(0);
//             this.player.anims.play('turn', true);
//         }

//         // === JUMP ===
//         if (this.cursors.up.isDown && this.player.body.touching.down) {
//             this.player.setVelocityY(-500);
//             this.sound.play('jump');
//         }

//         // === ENEMY AI ===
//         this.enemies.children.iterate(enemy => {
//             // Bounce at edges
//             if (enemy.body.velocity.x > 0 && enemy.x > this.width - 30) {
//                 enemy.setVelocityX(-100);
//             } else if (enemy.body.velocity.x < 0 && enemy.x < 30) {
//                 enemy.setVelocityX(100);
//             }
//         });
//     }
// }

// Page 2

// export default Level2Scene;

import { createAnimations } from "../utils/animations.js";

class Level2Scene extends Phaser.Scene {
  constructor() {
    super({ key: "Level2Scene" });
  }

  preload() {
    this.load.image("player", "assets/sprites/modi-player.png");
    this.load.image("platform", "assets/sprites/platforms.png");
    this.load.image("rssBadge", "assets/sprites/rss-badge.png");
    this.load.audio("jump", "assets/sounds/jump.mp3");
    this.load.audio("collect", "assets/sounds/collect.mp3");
  }

  create() {
    // Create STATIC ground
    const ground = this.physics.add.staticImage(400, 580, "platform");
    ground.setDisplaySize(800, 40);

    // Create FLOATING platforms (3 levels)
    const platform1 = this.physics.add.staticImage(300, 450, "platform");
    platform1.setDisplaySize(150, 30);

    const platform2 = this.physics.add.staticImage(600, 350, "platform");
    platform2.setDisplaySize(120, 30);

    const platform3 = this.physics.add.staticImage(200, 250, "platform");
    platform3.setDisplaySize(100, 30);

    // Create player
    this.player = this.physics.add.sprite(100, 450, "player");
    this.player.setBounce(0.1);
    this.player.setCollideWorldBounds(true);
    this.player.body.setDrag(100, 0);
    this.player.body.setMaxVelocity(300, 600);
    this.player.setDisplaySize(40, 60);

    // Collisions
    this.physics.add.collider(this.player, ground);
    this.physics.add.collider(this.player, platform1);
    this.physics.add.collider(this.player, platform2);
    this.physics.add.collider(this.player, platform3);

    // Create RSS badges (20 collectibles)
    this.rssBadges = this.physics.add.group();
    for (let i = 0; i < 20; i++) {
      const x = 150 + i * 35;
      const y = 200 + (i % 4) * 60;
      const badge = this.rssBadges.create(x, y, "rssBadge");
      badge.setBounceY(0.3);
      badge.setDisplaySize(30, 30);
    }

    // Score
    this.score = 0;
    this.scoreText = this.add.text(16, 16, "RSS Badges: 0", {
      fontSize: "24px",
      fill: "#fff",
    });

    // Level title
    this.add.text(300, 30, "LEVEL 2: RSS Pracharak Path", {
      fontSize: "32px",
      fill: "#fff",
      fontStyle: "bold",
    });

    // Controls
    this.cursors = this.input.keyboard.createCursorKeys();

    // Animations
    createAnimations(this);

    // Collect overlap
    this.physics.add.overlap(this.player, this.rssBadges, (player, badge) => {
      badge.disableBody(true, true);
      this.score++;
      this.scoreText.setText("RSS Badges: " + this.score);
      this.sound.play("collect");
    });

    // Sound
    this.sound.play("jump");
  }

  update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-200);
      this.player.anims.play("left", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(200);
      this.player.anims.play("right", true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play("turn", true);
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-500);
      this.sound.play("jump");
    }
  }
}

export default Level2Scene;
