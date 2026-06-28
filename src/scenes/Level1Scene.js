import { createAnimations } from "../utils/animations.js";
import { createTouchControls } from "../utils/touch-controls.js";
import { spawnEnemies, updateEnemies } from "../utils/enemies.js";
import { createHealthHUD, takeDamage } from "../utils/health.js";

export default class Level1Scene extends Phaser.Scene {
  constructor() {
    super({ key: "Level1Scene" });
  }

  preload() {
    // Dynamic textures are pre-generated in BootScene, so no loading is required here.
  }

  create() {
    // Background gradient style
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0x1a1a2e, 0x1a1a2e, 0x16213e, 0x16213e, 1);
    graphics.fillRect(0, 0, 800, 600);

    // ── Platforms ────────────────────────────────────────────────────────────
    const platform = this.physics.add.staticImage(400, 580, "platform");
    platform.setDisplaySize(800, 40).refreshBody();

    const floatPlatform1 = this.physics.add.staticImage(300, 440, "platform");
    floatPlatform1.setDisplaySize(180, 20).refreshBody();

    const floatPlatform2 = this.physics.add.staticImage(550, 320, "platform");
    floatPlatform2.setDisplaySize(180, 20).refreshBody();

    // ── Player ───────────────────────────────────────────────────────────────
    this.player = this.physics.add.sprite(100, 450, "player");
    this.player.setBounce(0.1);
    this.player.setCollideWorldBounds(true);
    this.player.setDisplaySize(40, 60);
    this.player.body.setDrag(100, 0);
    this.player.body.setMaxVelocity(300, 600);

    // ── Animations ───────────────────────────────────────────────────────────
    createAnimations(this);

    // ── Health HUD ───────────────────────────────────────────────────────────
    createHealthHUD(this);

    // ── Patrol enemies (2 on the floating platforms) ─────────────────────────
    const allPlatforms = [platform, floatPlatform1, floatPlatform2];
    spawnEnemies(this, [
      // Enemy on floatPlatform1 (top ~y=430, patrol across 180 px width)
      { x: 300, y: 390, left: 215, right: 380, speed: 80 },
      // Enemy on floatPlatform2 (top ~y=310, patrol across 180 px width)
      { x: 550, y: 270, left: 465, right: 635, speed: 90 },
    ], allPlatforms);

    // Player ↔ enemy: stomp to defeat, side-contact to take damage
    this.physics.add.overlap(this.player, this.enemies, (player, enemy) => {
      // Stomp: player falling AND their centre is above the enemy centre
      const stomping =
        player.body.velocity.y > 50 &&
        player.y + player.displayHeight / 2 < enemy.y;

      if (stomping) {
        enemy.disableBody(true, true);
        player.setVelocityY(-320); // satisfying bounce
      } else {
        takeDamage(this);
      }
    });

    // ── Collectibles (tea cups) ───────────────────────────────────────────────
    this.teaCups = this.physics.add.group({
      key: "teaCup",
      repeat: 14,
      setXY: { x: 120, y: 0, stepX: 45 },
    });

    this.teaCups.children.iterate((child) => {
      child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.4));
    });

    // ── Score ─────────────────────────────────────────────────────────────────
    this.score = 0;
    this.scoreText = this.add.text(16, 16, "Tea Cups: 0", {
      fontSize: "24px",
      fill: "#ff9933",
      fontStyle: "bold",
      fontFamily: "Courier, Arial, sans-serif",
    });

    // ── UI text ───────────────────────────────────────────────────────────────
    this.add.text(400, 72, "LEVEL 1: Vadnagar Origins", {
      fontSize: "26px",
      fill: "#ffffff",
      fontStyle: "bold",
      fontFamily: "Courier, Arial, sans-serif",
    }).setOrigin(0.5);

    this.controlsText = this.add.text(
      400, 565,
      "Use ← → to Move | ↑ to Jump | ↓ to Fast Fall | Avoid enemies! Collect 10 Cups to unlock Exit!",
      {
        fontSize: "14px",
        fill: "#aaaaaa",
        fontFamily: "Arial, sans-serif",
      }
    ).setOrigin(0.5);

    // ── Exit gate ─────────────────────────────────────────────────────────────
    this.exitGate = this.add.rectangle(750, 500, 40, 120, 0xffaa00);
    this.physics.add.existing(this.exitGate, true);

    this.exitOutline = this.add.graphics();
    this.exitOutline.lineStyle(3, 0xffcc00);
    this.exitOutline.strokeRect(730, 440, 40, 120);

    // ── Colliders ─────────────────────────────────────────────────────────────
    this.physics.add.collider(this.player, platform);
    this.physics.add.collider(this.player, floatPlatform1);
    this.physics.add.collider(this.player, floatPlatform2);
    this.physics.add.collider(this.teaCups, platform);
    this.physics.add.collider(this.teaCups, floatPlatform1);
    this.physics.add.collider(this.teaCups, floatPlatform2);

    // ── Overlaps ──────────────────────────────────────────────────────────────
    this.physics.add.overlap(this.player, this.teaCups, (player, cup) => {
      cup.disableBody(true, true);
      this.score += 1;
      this.scoreText.setText("Tea Cups: " + this.score);

      if (this.score >= 10) {
        this.controlsText.setText("Exit unlocked! Head to the rightmost gold gate!");
        this.controlsText.setFill("#00ff00");
      }
    });

    this.physics.add.overlap(this.player, this.exitGate, () => {
      if (this.score >= 10) {
        this.scene.start("Level2Scene");
      } else {
        this.showPrompt("Collect at least 10 Tea Cups first!");
      }
    });

    // ── Input ─────────────────────────────────────────────────────────────────
    this.cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.addCapture(["UP", "DOWN", "LEFT", "RIGHT"]);
    createTouchControls(this);
  }

  // ── Helpers ──────────────────────────────────────────────────────────────────

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

  // ── Game loop ─────────────────────────────────────────────────────────────────

  update() {
    // Freeze all movement when game over overlay is up
    if (this.gameOverTriggered) return;

    // Patrol enemies every frame
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
    }

    if (downDown && !(this.player.body.touching.down || this.player.body.blocked.down)) {
      this.player.setVelocityY(400);
    }
  }
}
