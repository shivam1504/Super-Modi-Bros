export function createAnimations(scene) {
  // Player walk animation
  scene.anims.create({
    key: "left",
    frames: scene.anims.generateFrameNumbers("player", { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1,
  });

  scene.anims.create({
    key: "right",
    frames: scene.anims.generateFrameNumbers("player", { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1,
  });

  scene.anims.create({
    key: "turn",
    frames: scene.anims.generateFrameNumbers("player", { start: 4, end: 4 }),
    frameRate: 10,
    repeat: 0,
  });
}

// In Level1Scene create():
createAnimations(this);

// In Level1Scene update():
if (this.cursors.left.isDown) {
  this.player.setVelocityX(-200);
  this.player.anims.play("left", true);
}
