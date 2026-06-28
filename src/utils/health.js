/**
 * Player health system — HUD, damage + invincibility frames, and Game Over screen.
 *
 * Usage:
 *   create()  → createHealthHUD(scene)
 *   on hit    → takeDamage(scene)
 */

/**
 * Initialises health state and renders the hearts HUD in the top-right corner.
 * @param {Phaser.Scene} scene
 */
export function createHealthHUD(scene) {
  scene.health            = 3;
  scene.maxHealth         = 3;
  scene.invincible        = false;
  scene.gameOverTriggered = false;

  scene.healthText = scene.add
    .text(784, 16, _buildHearts(3, 3), {
      fontSize:        '26px',
      fill:            '#ff2244',
      fontFamily:      'Arial, sans-serif',
      fontStyle:       'bold',
      stroke:          '#000000',
      strokeThickness: 3,
    })
    .setOrigin(1, 0)
    .setDepth(10);
}

/**
 * Applies one point of damage.
 * Grants invincibility frames and triggers Game Over when health hits 0.
 * @param {Phaser.Scene} scene
 */
export function takeDamage(scene) {
  if (scene.invincible || scene.gameOverTriggered) return;

  scene.health = Math.max(0, scene.health - 1);
  scene.healthText.setText(_buildHearts(scene.health, scene.maxHealth));

  if (scene.health <= 0) {
    _showGameOver(scene);
    return;
  }

  // Invincibility flash: 8 flickers over ~1.6 s
  scene.invincible = true;
  scene.tweens.add({
    targets:  scene.player,
    alpha:    0.15,
    duration: 100,
    yoyo:     true,
    repeat:   7,
    onComplete: () => {
      if (scene.player) scene.player.setAlpha(1);
      scene.invincible = false;
    },
  });
}

// ─── Internal ────────────────────────────────────────────────────────────────

function _buildHearts(current, max) {
  let s = '';
  for (let i = 0; i < max; i++) {
    s += (i < current) ? '♥' : '♡';
    if (i < max - 1) s += ' ';
  }
  return s;
}

function _showGameOver(scene) {
  scene.gameOverTriggered = true;
  scene.physics.pause();
  if (scene.player) scene.player.setVelocity(0);

  const W = scene.scale.width;
  const H = scene.scale.height;

  // Dark overlay
  scene.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.80).setDepth(20);

  // "GAME OVER" title
  scene.add.text(W / 2, H / 2 - 130, 'GAME OVER', {
    fontSize:        '64px',
    fontStyle:       'bold',
    fill:            '#ff2244',
    fontFamily:      'Courier, Arial, sans-serif',
    stroke:          '#000000',
    strokeThickness: 8,
  }).setOrigin(0.5).setDepth(21);

  // Flavour subtitle
  scene.add.text(W / 2, H / 2 - 58, "The obstacles blocked Modi's path!", {
    fontSize:   '20px',
    fill:       '#dddddd',
    fontFamily: 'Arial, sans-serif',
  }).setOrigin(0.5).setDepth(21);

  // ── Restart button ──────────────────────────────────────────────────────────
  const restartBtn = scene.add
    .text(W / 2, H / 2 + 38, '↺  RESTART LEVEL', {
      fontSize:        '28px',
      fontStyle:       'bold',
      fill:            '#000000',
      backgroundColor: '#ff9933',
      padding:         { x: 24, y: 14 },
      fontFamily:      'Courier, Arial, sans-serif',
    })
    .setOrigin(0.5)
    .setDepth(21)
    .setInteractive({ useHandCursor: true });

  restartBtn.on('pointerover',  () => restartBtn.setStyle({ fill: '#ffffff', backgroundColor: '#e07000' }));
  restartBtn.on('pointerout',   () => restartBtn.setStyle({ fill: '#000000', backgroundColor: '#ff9933' }));
  restartBtn.on('pointerdown',  () => scene.scene.restart());

  // ── Main Menu button ────────────────────────────────────────────────────────
  const menuBtn = scene.add
    .text(W / 2, H / 2 + 120, '⌂  MAIN MENU', {
      fontSize:        '22px',
      fontStyle:       'bold',
      fill:            '#ffffff',
      backgroundColor: '#333333',
      padding:         { x: 24, y: 14 },
      fontFamily:      'Courier, Arial, sans-serif',
    })
    .setOrigin(0.5)
    .setDepth(21)
    .setInteractive({ useHandCursor: true });

  menuBtn.on('pointerover',  () => menuBtn.setStyle({ backgroundColor: '#555555' }));
  menuBtn.on('pointerout',   () => menuBtn.setStyle({ backgroundColor: '#333333' }));
  menuBtn.on('pointerdown',  () => scene.scene.start('MainMenuScene'));
}
