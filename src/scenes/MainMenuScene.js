export default class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainMenuScene" });
  }

  create() {
    // Background color gradient style (drawn via Graphics)
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0x111111, 0x111111, 0x222233, 0x222233, 1);
    graphics.fillRect(0, 0, 800, 600);

    // Title (Main Heading)
    this.add.text(400, 180, "MODI'S JOURNEY", {
      fontSize: "48px",
      fontFamily: "Courier, Arial, sans-serif",
      fontStyle: "bold",
      fill: "#ff9933", // Saffron
      align: "center",
      stroke: "#000000",
      strokeThickness: 6
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(400, 240, "From Tea Stall to Prime Minister", {
      fontSize: "24px",
      fontFamily: "Courier, Arial, sans-serif",
      fill: "#ffffff",
      align: "center",
      stroke: "#000000",
      strokeThickness: 4
    }).setOrigin(0.5);

    // Dynamic decorative elements: RSS Flag and Tea Cup draw
    this.add.image(280, 340, "teaCup").setScale(1.5);
    this.add.image(520, 340, "rssBadge").setScale(1.5);

    // Instruction to start
    const startText = this.add.text(400, 420, "PRESS SPACE OR CLICK TO START", {
      fontSize: "20px",
      fontFamily: "Courier, Arial, sans-serif",
      fontStyle: "bold",
      fill: "#00ff00",
      align: "center",
      stroke: "#000000",
      strokeThickness: 3
    }).setOrigin(0.5);

    // Flashing effect for start text
    this.tweens.add({
      targets: startText,
      alpha: 0,
      duration: 800,
      yoyo: true,
      repeat: -1
    });

    // Level info hints
    this.add.text(400, 500, "Level 1: Vadnagar Origins (Tea cups & School Teacher)\nLevel 2: RSS Pracharak Path (Floating platforms & RSS badges)", {
      fontSize: "14px",
      fontFamily: "Arial, sans-serif",
      fill: "#aaaaaa",
      align: "center"
    }).setOrigin(0.5);

    // Input Listeners
    this.input.keyboard.on("keydown-SPACE", () => {
      this.scene.start("Level1Scene");
    });

    this.input.on("pointerdown", () => {
      this.scene.start("Level1Scene");
    });
  }
}
