/**
 * Enemy patrol factory and per-frame update utilities.
 *
 * Usage:
 *   create()  → spawnEnemies(scene, configs, platforms)
 *   update()  → updateEnemies(scene)
 */

/**
 * Creates patrol enemies and wires platform colliders.
 *
 * @param {Phaser.Scene} scene
 * @param {Array<{x:number, y:number, left:number, right:number, speed?:number}>} configs
 * @param {Phaser.GameObjects.GameObject[]} platforms  – all platforms enemies should stand on
 */
export function spawnEnemies(scene, configs, platforms) {
  scene.enemies = scene.physics.add.group();

  configs.forEach(cfg => {
    const enemy = scene.enemies.create(cfg.x, cfg.y, 'enemy');
    enemy.setDisplaySize(36, 54);
    enemy.setBounce(0);
    enemy.setCollideWorldBounds(true);
    enemy.body.setMaxVelocity(200, 800);

    // Patrol data lives directly on the game object
    enemy.patrolLeft  = cfg.left;
    enemy.patrolRight = cfg.right;
    enemy.patrolSpeed = cfg.speed ?? 80;
    enemy.patrolDir   = 1; // 1 = right, -1 = left

    platforms.forEach(plat => scene.physics.add.collider(enemy, plat));
  });
}

/**
 * Reverses enemy direction at patrol bounds and applies velocity.
 * Call this every frame from scene.update().
 *
 * @param {Phaser.Scene} scene
 */
export function updateEnemies(scene) {
  if (!scene.enemies) return;

  scene.enemies.getChildren().forEach(enemy => {
    if (!enemy.active) return;

    if (enemy.x >= enemy.patrolRight) enemy.patrolDir = -1;
    if (enemy.x <= enemy.patrolLeft)  enemy.patrolDir =  1;

    enemy.setVelocityX(enemy.patrolSpeed * enemy.patrolDir);
    // Mirror the sprite so it always faces its direction of travel
    enemy.setFlipX(enemy.patrolDir === -1);
  });
}
