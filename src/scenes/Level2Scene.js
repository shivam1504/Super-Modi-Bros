import { createAnimations } from "../utils/animations.js";
import { createTouchControls } from "../utils/touch-controls.js";
import { spawnEnemies, updateEnemies } from "../utils/enemies.js";
import { createHealthHUD, takeDamage } from "../utils/health.js";

export default class Level2Scene extends Phaser.Scene {
  constructor() {
    super({ key: "Level2Scene" });
  }

  preload() {
    // Dynamic textures are pre-generated in BootScene.
  }

  create() {
    // Background gradient
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0x1a052e, 0x1a052e, 0x050e2e, 0x050e2e, 1);
    graphics.fillRect(0, 0, 800, 600);

    // ── Platforms ─────────────────────────────────────────────────────────────
    const ground = this.physics.add.staticImage(400, 580, "platform");
    ground.setDisplaySize(800, 40).refreshBody();

    const platform1 = this.physics.add.staticImage(300, 450, "platform");
    platform1.setDisplaySize(150, 30).refreshBody();

    const platform2 = this.physics.add.staticImage(600, 350, "platform");
    platform2.setDisplaySize(120, 30).refreshBody();

    const platform3 = this.physics.add.staticImage(200, 250, "platform");
    platform3.setDisplaySize(100, 30).refreshBody();

    // ── Player ────────────────────────────────────────────────────────────────
    this.player = this.physics.add.sprite(100, 450, "player");
    this.player.setBounce(0.1);
    this.player.setCollideWorldBounds(true);
    this.player.body.setDrag(100, 0);
    this.player.body.setMaxVelocity(300, 600);
    this.player.setDisplaySize(40, 60);

    // ── Colliders (player ↔ platforms) ────────────────────────────────────────
    this.physics.add.collider(this.player, ground);
    this.physics.add.collider(this.player, platform1);
    this.physics.add.collider(this.player, platform2);
    this.physics.add.collider(this.player, platform3);

    // ── Animations ────────────────────────────────────────────────────────────
    createAnimations(this);

    // ── Health HUD ────────────────────────────────────────────────────────────
    createHealthHUD(this);

    // ── Patrol enemies (3 — one per floating platform) ────────────────────────
    const allPlatforms = [ground, platform1, platform2, platform3];
    spawnEnemies(this, [
      // platform1 (150 wide, x=225..375): spawn above centre
      { x: 300, y: 400, left: 240, right: 360, speed: 100 },
      // platform2 (120 wide, x=540..660): spawn above centre
      { x: 600, y: 300, left: 555, right: 645, speed: 100 },
      // platform3 (100 wide, x=150..250): slower on the narrow platform
      { x: 200, y: 195, left: 163, right: 237, speed: 65  },
    ], allPlatforms);

    // Player ↔ enemy: stomp or take damage
    this.physics.add.overlap(this.player, this.enemies, (player, enemy) => {
      const stomping =
        player.body.velocity.y > 50 &&
        player.y + player.displayHeight / 2 < enemy.y;

      if (stomping) {
        enemy.disableBody(true, true);
        player.setVelocityY(-320);
      } else {
        takeDamage(this);
      }
    });

    // ── RSS Badges (20 collectibles) ──────────────────────────────────────────
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

    // ── Score ─────────────────────────────────────────────────────────────────
    this.score = 0;
    this.scoreText = this.add.text(16, 16, "RSS Badges: 0", {
      fontSize: "24px",
      fill: "#ff9933",
      fontStyle: "bold",
      fontFamily: "Courier, Arial, sans-serif",
    });

    // ── UI text ───────────────────────────────────────────────────────────────
    this.add.text(400, 30, "LEVEL 2: RSS Pracharak Path", {
      fontSize: "32px",
      fill: "#fff",
      fontStyle: "bold",
      fontFamily: "Courier, Arial, sans-serif",
    }).setOrigin(0.5);

    this.controlsText = this.add.text(
      400, 565,
      "Avoid enemies! Collect 15 RSS Badges and reach the Saffron gate to complete the game!",
      {
        fontSize: "14px",
        fill: "#aaaaaa",
        fontFamily: "Arial, sans-serif",
      }
    ).setOrigin(0.5);

    // ── Victory exit gate ─────────────────────────────────────────────────────
    this.exitGate = this.add.rectangle(750, 500, 40, 120, 0xff5500);
    this.physics.add.existing(this.exitGate, true);

    this.exitOutline = this.add.graphics();
    this.exitOutline.lineStyle(3, 0xff9933);
    this.exitOutline.strokeRect(730, 440, 40, 120);

    // ── Overlaps ──────────────────────────────────────────────────────────────
    this.physics.add.overlap(this.player, this.rssBadges, (player, badge) => {
      badge.disableBody(true, true);
      this.score++;
      this.scoreText.setText("RSS Badges: " + this.score);
      if (this.score >= 15) {
        this.controlsText.setText("Exit unlocked! Head to the rightmost Saffron gate!");
        this.controlsText.setFill("#00ff00");
      }
    });

    this.physics.add.overlap(this.player, this.exitGate, () => {
      if (this.score >= 15) {
        this.showVictoryScreen();
      } else {
        this.showPrompt("Collect at least 15 RSS Badges first!");
      }
    });

    // ── Input ─────────────────────────────────────────────────────────────────
    this.cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.addCapture(["UP", "DOWN", "LEFT", "RIGHT"]);
    createTouchControls(this);
  }

  // ── Helpers ──────────────────────────────────────────────────────────────────

  safePlaySound(key) {
    if (this.cache.audio.exists(key)) this.sound.play(key);
  }

  showPrompt(msg) {
    if (this.promptText) this.promptText.destroy();

    this.promptText = this.add.text(400, 300, msg, {
      fontSize: "24px",
      fill: "#ff0000",
      backgroundColor: "#000000",
      padding: { x: 15, y: 10 },
      fontStyle: "bold",
      fontFamily: "Arial, sans-serif",
    }).setOrigin(0.5);

    this.time.delayedCall(2000, () => {
      if (this.promptText) this.promptText.destroy();
    });
  }

  showVictoryScreen() {
    if (this.gameOverTriggered) return; // already showing a screen
    this.gameOverTriggered = true;
    this.physics.pause();
    this.player.setVelocity(0);
    this.player.anims.play("turn");

    const victoryBg = this.add.rectangle(400, 300, 500, 300, 0x000000, 0.9);
    victoryBg.setStrokeStyle(4, 0xffcc00);

    this.add.text(400, 200, "VICTORY!", {
      fontSize: "48px",
      fontStyle: "bold",
      fill: "#00ff00",
      fontFamily: "Courier, Arial, sans-serif",
    }).setOrigin(0.5);

    this.add.text(400, 280, "You completed Modi's early journey\nfrom Vadnagar to RSS Pracharak!", {
      fontSize: "20px",
      fill: "#ffffff",
      align: "center",
      fontFamily: "Arial, sans-serif",
    }).setOrigin(0.5);

    const restartBtn = this.add.text(400, 380, "PLAY AGAIN", {
      fontSize: "24px",
      fontStyle: "bold",
      fill: "#000000",
      backgroundColor: "#ff9933",
      padding: { x: 20, y: 10 },
      fontFamily: "Courier, Arial, sans-serif",
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    restartBtn.on("pointerdown", () => this.scene.start("MainMenuScene"));
  }

  // ── Game loop ─────────────────────────────────────────────────────────────────

  update() {
    if (this.gameOverTriggered) return;

    updateEnemies(this);

    const leftDown  = this.cursors.left.isDown  || this.touchLeft;
    const rightDown = this.cursors.right.isDown || this.touchRight;
    const upDown    = this.cursors.up.isDown    || this.touchUp;
    const downDown  = this.cursors.down.isDown  || this.touchDown;

    if (leftDown) {
      this.player.setVelocityX(-200);
      this.player.anims.play("left", true);
    } else if (rightDown) {
      this.player.setVelocityX(200);
      this.player.anims.play("right", true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play("turn", true);
    }

    if (upDown && (this.player.body.touching.down || this.player.body.blocked.down)) {
      this.player.setVelocityY(-450);
      this.safePlaySound("jump");
    }

    if (downDown && !(this.player.body.touching.down || this.player.body.blocked.down)) {
      this.player.setVelocityY(400);
    }
  }
}
