export default class Level1Scene extends Phaser.Scene {
  constructor() {
    super({ key: "Level1Scene" });
  }

  preload() {
    // Load assets
    this.load.image("player", "assets/sprites/modi-player.png");
    this.load.image("platform", "assets/sprites/platforms.png");
    this.load.image("teaCup", "assets/sprites/tea-cups.png");
  }

  create() {
    // Create platforms
    const platform = this.physics.add.staticImage(400, 580, "platform");
    platform.setDisplaySize(800, 40);

    // Create player (Modi character)
    this.player = this.physics.add.sprite(100, 450, "player");
    this.player.setBounce(0.1);
    this.player.setCollideWorldBounds(true);

    // Player physics
    this.player.body.setDrag(100, 0);
    this.player.body.setMaxVelocity(300, 600);

    // Collectibles (tea cups)
    this.teaCups = this.physics.add.group({
      key: "teaCup",
      repeat: 15,
      setXY: { x: 100, y: 0, stepX: 40 },
    });

    this.teaCups.children.iterate((child) => {
      child.setBounceY(0.3);
    });

    // Collisions
    this.physics.add.collider(this.player, platform);
    this.physics.add.collider(this.teaCups, platform);

    // Score
    this.score = 0;
    this.scoreText = this.add.text(16, 16, "Tea Cups: 0", {
      fontSize: "24px",
      fill: "#fff",
    });

    // Controls
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    // Left/Right movement
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-200);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(200);
    } else {
      this.player.setVelocityX(0);
    }

    // Jump
    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-500);
    }

    // Collect tea cups
    this.physics.add.overlap(this.player, this.teaCups, (player, cup) => {
      cup.disableBody(true, true);
      this.score += 1;
      this.scoreText.setText("Tea Cups: " + this.score);
    });
  }
}
