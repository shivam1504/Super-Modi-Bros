import { createAnimations } from "../utils/animations.js";

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

    // Create ground platform
    const platform = this.physics.add.staticImage(400, 580, "platform");
    platform.setDisplaySize(800, 40);

    // Create a couple of middle floating platforms to make it a platformer
    const floatPlatform1 = this.physics.add.staticImage(300, 440, "platform");
    floatPlatform1.setDisplaySize(180, 20);

    const floatPlatform2 = this.physics.add.staticImage(550, 320, "platform");
    floatPlatform2.setDisplaySize(180, 20);

    // Create player (Modi character)
    this.player = this.physics.add.sprite(100, 450, "player");
    this.player.setBounce(0.1);
    this.player.setCollideWorldBounds(true);

    // Player physics
    this.player.body.setDrag(100, 0);
    this.player.body.setMaxVelocity(300, 600);

    // Setup animations
    createAnimations(this);

    // Collectibles (tea cups)
    this.teaCups = this.physics.add.group({
      key: "teaCup",
      repeat: 14,
      setXY: { x: 120, y: 0, stepX: 45 },
    });

    this.teaCups.children.iterate((child) => {
      child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.4));
    });

    // Score Setup
    this.score = 0;
    this.scoreText = this.add.text(16, 16, "Tea Cups: 0", {
      fontSize: "24px",
      fill: "#ff9933", // Saffron
      fontStyle: "bold",
      fontFamily: "Courier, Arial, sans-serif"
    });

    // Instructions/Level Title Text
    this.add.text(400, 30, "LEVEL 1: Vadnagar Origins", {
      fontSize: "32px",
      fill: "#ffffff",
      fontStyle: "bold",
      fontFamily: "Courier, Arial, sans-serif"
    }).setOrigin(0.5);

    // Help controls guide
    this.controlsText = this.add.text(400, 565, "Use ← and → to Move | ↑ to Jump | Collect 10 Cups to unlock Exit!", {
      fontSize: "16px",
      fill: "#aaaaaa",
      fontFamily: "Arial, sans-serif"
    }).setOrigin(0.5);

    // Exit gate (drawn dynamically as a gold/orange rectangle)
    this.exitGate = this.add.rectangle(750, 500, 40, 120, 0xffaa00);
    this.physics.add.existing(this.exitGate, true);
    
    // Add glowing outline to exit gate
    this.exitOutline = this.add.graphics();
    this.exitOutline.lineStyle(3, 0xffcc00);
    this.exitOutline.strokeRect(730, 440, 40, 120);

    // Collisions (Set up ONCE in create)
    this.physics.add.collider(this.player, platform);
    this.physics.add.collider(this.player, floatPlatform1);
    this.physics.add.collider(this.player, floatPlatform2);
    this.physics.add.collider(this.teaCups, platform);
    this.physics.add.collider(this.teaCups, floatPlatform1);
    this.physics.add.collider(this.teaCups, floatPlatform2);

    // Overlap for tea cup collection
    this.physics.add.overlap(this.player, this.teaCups, (player, cup) => {
      cup.disableBody(true, true);
      this.score += 1;
      this.scoreText.setText("Tea Cups: " + this.score);
      
      // Update help text if goal reached
      if (this.score >= 10) {
        this.controlsText.setText("Exit unlocked! Head to the rightmost gold gate!");
        this.controlsText.setFill("#00ff00");
      }
    });

    // Overlap for level exit gate
    this.physics.add.overlap(this.player, this.exitGate, () => {
      if (this.score >= 10) {
        console.log("Entering Level 2...");
        this.scene.start("Level2Scene");
      } else {
        // Show temporary prompt
        this.showPrompt("Collect at least 10 Tea Cups first!");
      }
    });

    // Controls
    this.cursors = this.input.keyboard.createCursorKeys();
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

  update() {
    // Left/Right movement
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

    // Jump
    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-450);
    }
  }
}
