export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: "BootScene" });
  }

  preload() {
    // We can preload sound assets if they exist, but since they don't,
    // we'll handle sound gracefully by catching errors or not loading them.
  }

  create() {
    console.log("Booting game, generating dynamic textures...");

    // 1. Generate Player Spritesheet
    this.generatePlayerSpritesheet();

    // 2. Generate Platform Texture
    this.generatePlatformTexture();

    // 3. Generate Tea Cup Texture
    this.generateTeaCupTexture();

    // 4. Generate RSS Badge Texture
    this.generateRSSBadgeTexture();

    // 5. Generate Enemy Texture
    this.generateEnemyTexture();

    // Transition to main menu
    this.scene.start("MainMenuScene");
  }

  generatePlayerSpritesheet() {
    const frameWidth = 32;
    const frameHeight = 48;
    const totalFrames = 9;
    
    // Create canvas texture with a temporary key
    const canvas = this.textures.createCanvas("player_temp_canvas", frameWidth * totalFrames, frameHeight);
    const ctx = canvas.context;

    for (let i = 0; i < totalFrames; i++) {
      const offsetX = i * frameWidth;

      // Draw background/body (Saffron jacket/kurta)
      ctx.fillStyle = "#ff9933"; // Indian Saffron
      ctx.fillRect(offsetX + 6, 18, 20, 18);

      // Draw pants/pajama
      ctx.fillStyle = "#f5f5f5"; // Off-white
      ctx.fillRect(offsetX + 8, 34, 16, 8);

      // Draw legs (walking animation offsets)
      ctx.fillStyle = "#222222"; // Dark grey shoes
      let legL = 42;
      let legR = 42;
      if (i >= 0 && i <= 3) {
        // Walking left leg patterns
        legL = 40 + (i % 2) * 4;
        legR = 40 + ((i + 1) % 2) * 4;
      } else if (i >= 5 && i <= 8) {
        // Walking right leg patterns
        legL = 40 + ((i - 5) % 2) * 4;
        legR = 40 + ((i - 4) % 2) * 4;
      }
      ctx.fillRect(offsetX + 10, legL, 4, 6);
      ctx.fillRect(offsetX + 18, legR, 4, 6);

      // Draw face
      ctx.fillStyle = "#ffe0bd"; // Skin tone
      ctx.fillRect(offsetX + 8, 6, 16, 12);

      // Draw iconic white hair & beard
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(offsetX + 6, 4, 20, 3);   // Top hair
      ctx.fillRect(offsetX + 6, 7, 3, 8);     // Side L hair
      ctx.fillRect(offsetX + 23, 7, 3, 8);    // Side R hair
      ctx.fillRect(offsetX + 8, 14, 16, 5);   // Beard

      // Draw eyes
      ctx.fillStyle = "#000000";
      if (i >= 0 && i <= 3) {
        // Left facing eyes
        ctx.fillRect(offsetX + 10, 9, 2, 2);
      } else if (i >= 5 && i <= 8) {
        // Right facing eyes
        ctx.fillRect(offsetX + 20, 9, 2, 2);
      } else {
        // Center facing eyes
        ctx.fillRect(offsetX + 11, 9, 2, 2);
        ctx.fillRect(offsetX + 19, 9, 2, 2);
      }

      // Draw glasses (spec/specs)
      ctx.strokeStyle = "#555555";
      ctx.lineWidth = 1;
      if (i >= 0 && i <= 3) {
        ctx.strokeRect(offsetX + 9, 8, 4, 4);
      } else if (i >= 5 && i <= 8) {
        ctx.strokeRect(offsetX + 19, 8, 4, 4);
      } else {
        ctx.strokeRect(offsetX + 10, 8, 4, 4);
        ctx.strokeRect(offsetX + 18, 8, 4, 4);
        ctx.beginPath();
        ctx.moveTo(offsetX + 14, 10);
        ctx.lineTo(offsetX + 18, 10);
        ctx.stroke();
      }
    }

    canvas.refresh();

    // Register as spritesheet in Phaser
    this.textures.addSpriteSheet("player", canvas.getSourceImage(), {
      frameWidth: frameWidth,
      frameHeight: frameHeight,
    });
  }

  generatePlatformTexture() {
    const width = 64;
    const height = 64;
    const canvas = this.textures.createCanvas("platform", width, height);
    const ctx = canvas.context;

    // Base color (gray stone brick texture)
    ctx.fillStyle = "#4e4e4e";
    ctx.fillRect(0, 0, width, height);

    // Brick highlights
    ctx.fillStyle = "#636363";
    ctx.fillRect(2, 2, 28, 12);
    ctx.fillRect(34, 2, 28, 12);
    ctx.fillRect(2, 18, 12, 12);
    ctx.fillRect(18, 18, 28, 12);
    ctx.fillRect(50, 18, 12, 12);
    ctx.fillRect(2, 34, 28, 12);
    ctx.fillRect(34, 34, 28, 12);
    ctx.fillRect(2, 50, 12, 12);
    ctx.fillRect(18, 50, 28, 12);
    ctx.fillRect(50, 50, 12, 12);

    // Brick shadows
    ctx.fillStyle = "#2c2c2c";
    ctx.fillRect(0, 14, 64, 2);
    ctx.fillRect(0, 30, 64, 2);
    ctx.fillRect(0, 46, 64, 2);
    ctx.fillRect(0, 62, 64, 2);
    
    ctx.fillRect(30, 0, 2, 14);
    ctx.fillRect(14, 14, 2, 16);
    ctx.fillRect(46, 14, 2, 16);
    ctx.fillRect(30, 30, 2, 16);
    ctx.fillRect(14, 46, 2, 16);
    ctx.fillRect(46, 46, 2, 16);

    canvas.refresh();
  }

  generateTeaCupTexture() {
    const size = 32;
    const canvas = this.textures.createCanvas("teaCup", size, size);
    const ctx = canvas.context;

    // Clear background
    ctx.clearRect(0, 0, size, size);

    // Draw clay tea cup (Kullhad style)
    ctx.fillStyle = "#d27d2d"; // Clay brown/orange
    ctx.beginPath();
    ctx.moveTo(8, 8);
    ctx.lineTo(24, 8);
    ctx.lineTo(20, 26);
    ctx.lineTo(12, 26);
    ctx.closePath();
    ctx.fill();

    // Hot tea inside cup
    ctx.fillStyle = "#6f4e37"; // Coffee/tea brown
    ctx.beginPath();
    ctx.moveTo(9, 10);
    ctx.lineTo(23, 10);
    ctx.lineTo(22, 14);
    ctx.lineTo(10, 14);
    ctx.closePath();
    ctx.fill();

    // Handle
    ctx.strokeStyle = "#d27d2d";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(23, 16, 4, -Math.PI/2, Math.PI/2);
    ctx.stroke();

    // Steam waves
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(12, 5);
    ctx.quadraticCurveTo(14, 3, 12, 1);
    ctx.moveTo(16, 6);
    ctx.quadraticCurveTo(18, 4, 16, 2);
    ctx.moveTo(20, 5);
    ctx.quadraticCurveTo(22, 3, 20, 1);
    ctx.stroke();

    canvas.refresh();
  }

  generateRSSBadgeTexture() {
    const size = 32;
    const canvas = this.textures.createCanvas("rssBadge", size, size);
    const ctx = canvas.context;

    ctx.clearRect(0, 0, size, size);

    // Draw Pole
    ctx.fillStyle = "#8b5a2b"; // Brown pole
    ctx.fillRect(6, 2, 3, 28);

    // Draw Saffron Flag (Bhagwa) - Double triangular shape
    ctx.fillStyle = "#ff9933"; // Saffron
    ctx.beginPath();
    ctx.moveTo(9, 4);
    ctx.lineTo(28, 9);
    ctx.lineTo(14, 14);
    ctx.lineTo(28, 19);
    ctx.lineTo(9, 24);
    ctx.closePath();
    ctx.fill();

    canvas.refresh();
  }

  generateEnemyTexture() {
    // A dark-uniformed "bureaucrat" antagonist — 32×48, single static frame.
    const w = 32, h = 48;
    const canvas = this.textures.createCanvas('enemy', w, h);
    const ctx = canvas.context;

    // ── Legs ───────────────────────────────────────────────────────────────
    ctx.fillStyle = '#2c3020'; // Dark olive trousers
    ctx.fillRect(9,  34, 6, 8);
    ctx.fillRect(17, 34, 6, 8);

    // Shoes
    ctx.fillStyle = '#111111';
    ctx.fillRect(8,  41, 7, 5);
    ctx.fillRect(17, 41, 7, 5);

    // ── Body / jacket ──────────────────────────────────────────────────────
    ctx.fillStyle = '#3a4232'; // Dark khaki-green suit
    ctx.fillRect(7, 18, 18, 17);

    // White collar / shirt
    ctx.fillStyle = '#dddddd';
    ctx.fillRect(13, 17, 6, 5);

    // Red tie
    ctx.fillStyle = '#bb0000';
    ctx.fillRect(15, 19, 3, 11);
    ctx.fillRect(14, 28, 5, 3); // tie knot base

    // ── Face ───────────────────────────────────────────────────────────────
    ctx.fillStyle = '#c8a882'; // Skin tone
    ctx.fillRect(9, 6, 14, 13);

    // Dark hair
    ctx.fillStyle = '#111111';
    ctx.fillRect(8,  3, 16, 5);
    ctx.fillRect(8,  6, 3,  6);
    ctx.fillRect(21, 6, 3,  6);

    // Beady eyes
    ctx.fillStyle = '#220000';
    ctx.fillRect(11, 11, 2, 2);
    ctx.fillRect(19, 11, 2, 2);

    // Frown
    ctx.strokeStyle = '#553333';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(13, 17);
    ctx.quadraticCurveTo(16, 15, 19, 17);
    ctx.stroke();

    canvas.refresh();
  }
}
