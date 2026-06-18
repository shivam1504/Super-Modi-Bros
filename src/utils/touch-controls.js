/**
 * Touch Controls Utility
 * Adds virtual buttons for mobile support
 */
export function createTouchControls(scene) {
  // Only create controls if touch device is detected
  if (!scene.sys.game.device.input.touch) {
    return;
  }

  console.log("Touch device detected, creating virtual controls...");

  // Initialize state flags on scene
  scene.touchLeft = false;
  scene.touchRight = false;
  scene.touchUp = false;
  scene.touchDown = false;

  // Visual styling parameters
  const color = 0xffffff;
  const alphaNormal = 0.35;
  const alphaPressed = 0.7;
  const radius = 35;
  const yPos = 500;

  // Helper to create a button
  function createButton(x, y, label, pressCallback, releaseCallback) {
    const btnContainer = scene.add.container(x, y);

    // Circle background
    const bg = scene.add.graphics();
    bg.fillStyle(color, alphaNormal);
    bg.fillCircle(0, 0, radius);
    bg.lineStyle(3, color, alphaNormal + 0.2);
    bg.strokeCircle(0, 0, radius);

    // Text Label
    const text = scene.add.text(0, 0, label, {
      fontSize: "28px",
      fontStyle: "bold",
      fill: "#ffffff",
      fontFamily: "Arial, sans-serif"
    }).setOrigin(0.5);

    btnContainer.add([bg, text]);

    // Make interactive
    const hitArea = new Phaser.Geom.Circle(0, 0, radius);
    btnContainer.setInteractive(hitArea, Phaser.Geom.Circle.Contains);

    btnContainer.on("pointerdown", () => {
      bg.clear();
      bg.fillStyle(color, alphaPressed);
      bg.fillCircle(0, 0, radius);
      bg.lineStyle(3, color, alphaPressed + 0.1);
      bg.strokeCircle(0, 0, radius);
      pressCallback();
    });

    const release = () => {
      bg.clear();
      bg.fillStyle(color, alphaNormal);
      bg.fillCircle(0, 0, radius);
      bg.lineStyle(3, color, alphaNormal + 0.2);
      bg.strokeCircle(0, 0, radius);
      releaseCallback();
    };

    btnContainer.on("pointerup", release);
    btnContainer.on("pointerout", release);

    // Fix container depth to ensure controls stay on top of the map/sprites
    btnContainer.setScrollFactor(0);
    btnContainer.setDepth(1000);

    return btnContainer;
  }

  // Left & Right (Bottom Left)
  createButton(60, yPos, "◀", () => scene.touchLeft = true, () => scene.touchLeft = false);
  createButton(150, yPos, "▶", () => scene.touchRight = true, () => scene.touchRight = false);

  // Down & Up/Jump (Bottom Right)
  createButton(650, yPos, "▼", () => scene.touchDown = true, () => scene.touchDown = false);
  createButton(740, yPos, "▲", () => scene.touchUp = true, () => scene.touchUp = false);
}
