// // Main Phaser Game Configuration
// const config = {
//     type: Phaser.AUTO,
//     width: 800,
//     height: 600,
//     parent: 'game-container',
//     physics: {
//         default: 'arcade',
//         arcade: {
//             gravity: { y: 600 },  // Mario-style gravity
//             debug: false
//         }
//     },
//     scene: [
//         BootScene,
//         MainMenuScene,
//         Level1Scene
//     ]
// };

// const game = new Phaser.Game(config);

// Attempt 2

// Import scenes
// import BootScene from './src/scenes/BootScene.js';
// import MainMenuScene from './src/scenes/MainMenuScene.js';
// import Level1Scene from './src/scenes/Level1Scene.js';
// import Level2Scene from './src/scenes/Level2Scene.js';

// // Main Phaser Game Configuration
// const config = {
//     type: Phaser.AUTO,
//     width: 800,
//     height: 600,
//     parent: 'game-container',
//     physics: {
//         default: 'arcade',
//         arcade: {
//             gravity: { y: 600 },
//             debug: false
//         }
//     },
//     scene: [
//         BootScene,
//         MainMenuScene,
//         Level1Scene,
//         Level2Scene
//     ]
// };

// const game = new Phaser.Game(config);

// Atempt 3

// Import scenes (if using ES modules)
import BootScene from "./src/scenes/BootScene.js";
import MainMenuScene from "./src/scenes/MainMenuScene.js";
import Level1Scene from "./src/scenes/Level1Scene.js";
import Level2Scene from "./src/scenes/Level2Scene.js";

// Game Configuration
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "game-container",
  backgroundColor: "#2d2d2d",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 600 },
      debug: false,
    },
  },
  scene: [BootScene, MainMenuScene, Level1Scene, Level2Scene],
};

// Create Game
const game = new Phaser.Game(config);

console.log("Modi Game Started!");
