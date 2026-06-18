import { createAnimations } from "../utils/animations.js";

export default class Level2Scene extends Phaser.Scene {
  constructor() {
    super({ key: "Level2Scene" });
  }

  preload() {
    // Dynamic textures are pre-generated in BootScene.
    // Audio files do not exist in the project, so we don't attempt to load them.
  }

  create() {
    // Background gradient
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0x1a052e, 0x1a052e, 0x050e2e, 0x050e2e, 1);
    graphics.fillRect(0, 0, 800, 600);

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
      const x = 150 + i * 32;
      const y = 200 + (i % 4) * 60;
      const badge = this.rssBadges.create(x, y, "rssBadge");
      badge.setBounceY(0.3);
      badge.setDisplaySize(30, 30);
    }

    this.physics.add.collider(this.rssBadges, ground);
    this.physics.add.collider(this.rssBadges, platform1);
    this.physics.add.collider(this.rssBadges, platform2);
    this.physics.add.collider(this.rssBadges, platform3);

    // Score
    this.score = 0;
    this.scoreText = this.add.text(16, 16, "RSS Badges: 0", {
      fontSize: "24px",
      fill: "#ff9933", // Saffron
      fontStyle: "bold",
      fontFamily: "Courier, Arial, sans-serif"
    });

    // Level title
    this.add.text(400, 30, "LEVEL 2: RSS Pracharak Path", {
      fontSize: "32px",
      fill: "#fff",
      fontStyle: "bold",
      fontFamily: "Courier, Arial, sans-serif"
    }).setOrigin(0.5);

    // Help/Controls hint
    this.controlsText = this.add.text(400, 565, "Collect 15 RSS Badges and reach the Saffron gate to complete the game!", {
      fontSize: "16px",
      fill: "#aaaaaa",
      fontFamily: "Arial, sans-serif"
    }).setOrigin(0.5);

    // Victory Exit Gate
    this.exitGate = this.add.rectangle(750, 500, 40, 120, 0xff5500);
    this.physics.add.existing(this.exitGate, true);

    this.exitOutline = this.add.graphics();
    this.exitOutline.lineStyle(3, 0xff9933);
    this.exitOutline.strokeRect(730, 440, 40, 120);

    // Controls
    this.cursors = this.input.keyboard.createCursorKeys();

    // Animations
    createAnimations(this);

    // Collect overlap
    this.physics.add.overlap(this.player, this.rssBadges, (player, badge) => {
      badge.disableBody(true, true);
      this.score++;
      this.scoreText.setText("RSS Badges: " + this.score);
      this.safePlaySound("collect");

      if (this.score >= 15) {
        this.controlsText.setText("Exit unlocked! Head to the rightmost Saffron gate!");
        this.controlsText.setFill("#00ff00");
      }
    });

    // Exit gate overlap
    this.physics.add.overlap(this.player, this.exitGate, () => {
      if (this.score >= 15) {
        this.showVictoryScreen();
      } else {
        this.showPrompt("Collect at least 15 RSS Badges first!");
      }
    });

    this.safePlaySound("jump");
  }

  safePlaySound(key) {
    if (this.cache.audio.exists(key)) {
      this.sound.play(key);
    }
  }

  showPrompt(msg) {
    if (this.promptText) this.promptText.destroy();
    
    this.promptText = this.add.text(400, 300, msg, {
      fontSize: "24px",
      fill: "#ff0000",
      backgroundColor: "#000000",
      padding: { x: 15, y: 10 },
      fontStyle: "bold",
      fontFamily: "Arial, sans-serif"
    }).setOrigin(0.5);

    this.time.delayedCall(2000, () => {
      if (this.promptText) this.promptText.destroy();
    });
  }

  showVictoryScreen() {
    // Stop physics/player
    this.physics.pause();
    this.player.setVelocity(0);
    this.player.anims.play("turn");

    // Victory Banner
    const victoryBg = this.add.rectangle(400, 300, 500, 300, 0x000000, 0.9);
    victoryBg.setStrokeStyle(4, 0xffcc00);

    this.add.text(400, 200, "VICTORY!", {
      fontSize: "48px",
      fontStyle: "bold",
      fill: "#00ff00",
      fontFamily: "Courier, Arial, sans-serif"
    }).setOrigin(0.5);

    this.add.text(400, 280, "You completed Modi's early journey\nfrom Vadnagar to RSS Pracharak!", {
      fontSize: "20px",
      fill: "#ffffff",
      align: "center",
      fontFamily: "Arial, sans-serif"
    }).setOrigin(0.5);

    const restartBtn = this.add.text(400, 380, "PLAY AGAIN", {
      fontSize: "24px",
      fontStyle: "bold",
      fill: "#000000",
      backgroundColor: "#ff9933",
      padding: { x: 20, y: 10 },
      fontFamily: "Courier, Arial, sans-serif"
    }).setOrigin(0.5);

    restartBtn.setInteractive({ useHandCursor: true });
    restartBtn.on("pointerdown", () => {
      this.scene.start("MainMenuScene");
    });
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
      this.player.setVelocityY(-450);
      this.safePlaySound("jump");
    }
  }
}
