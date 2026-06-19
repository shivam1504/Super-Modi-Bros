# Modi's Journey: From Tea Stall to PM

## Detailed Development Plan

### 1. Project Overview

**Title:** Modi's Journey: From Tea Stall to PM

**Genre:** 2D Educational Platformer / Adventure

**Framework:** Phaser 3

**Goal:**
Players experience major milestones in Narendra Modi's life through interactive levels, progressing from childhood to becoming Prime Minister of India.

---

# 2. Technical Setup

## Folder Structure

```
project/
│
├── index.html
├── game.js
├── css/
│   └── style.css
│
├── assets/
│   ├── images/
│   ├── sprites/
│   ├── backgrounds/
│   ├── ui/
│   └── audio/
│
├── scenes/
│   ├── BootScene.js
│   ├── MenuScene.js
│   ├── TeaStallScene.js
│   ├── YouthScene.js
│   ├── RSSScene.js
│   ├── PoliticsScene.js
│   ├── PMScene.js
│   └── EndScene.js
│
└── managers/
    ├── GameManager.js
    └── SaveManager.js
```

---

# 3. Core Gameplay Mechanics

## Player Movement

Features:

- Move left/right
- Jump
- Collect items
- Interact with NPCs
- Trigger dialogues
- Complete objectives

Controls:

| Key   | Action     |
| ----- | ---------- |
| A / ← | Move Left  |
| D / → | Move Right |
| Space | Jump       |
| E     | Interact   |
| Esc   | Pause      |

---

# 4. Scene Breakdown

## Scene 1: Childhood & Tea Stall

### Objective

Help at the family tea stall.

### Gameplay

Player must:

- Serve customers
- Collect tea ingredients
- Deliver tea cups

### Challenges

- Time limit
- Customer queue management

### Rewards

- Experience points
- Story progression

### Educational Content

Introduction to Narendra Modi's childhood and family background.

---

## Scene 2: Youth Exploration

### Objective

Travel and learn from different regions.

### Gameplay

- Visit locations
- Talk with mentors
- Collect knowledge tokens

### Challenges

- Exploration puzzles
- Navigation tasks

### Rewards

- New abilities
- Story unlocks

---

## Scene 3: Organizational Work

### Objective

Build organizational skills.

### Gameplay

- Complete missions
- Coordinate volunteers
- Solve logistics problems

### Challenges

- Resource management
- Planning tasks

### Rewards

- Leadership points

---

## Scene 4: Political Leadership

### Objective

Manage public initiatives.

### Gameplay

- Complete development projects
- Address citizen requests
- Balance resources

### Challenges

- Decision-making scenarios
- Strategic planning

### Rewards

- Reputation score

---

## Scene 5: Prime Minister Journey

### Objective

Complete national-level challenges.

### Gameplay

- Launch initiatives
- Handle events
- Manage public approval

### Challenges

- Multiple simultaneous objectives
- Time-sensitive decisions

### Victory Condition

Successfully complete key missions and achieve high approval ratings.

---

# 5. NPC System

Types of NPCs:

### Citizens

- Give quests
- Provide feedback

### Mentors

- Teach mechanics
- Share story information

### Officials

- Assign major missions
- Evaluate progress

---

# 6. Dialogue System

Features:

- Character portraits
- Typewriter effect
- Skip button
- Multiple dialogue choices

Example:

```
Citizen:
"Can you help deliver tea to the station?"

1. Yes
2. Not now
```

---

# 7. Progression System

## Experience Points

Earn XP from:

- Completing quests
- Collecting items
- Solving puzzles

## Unlockables

- New areas
- Story chapters
- Character upgrades

---

# 8. UI Design

## Main Menu

- Start Game
- Continue
- Settings
- Credits

## HUD

Display:

- Score
- XP
- Current objective
- Health/Energy
- Pause button

---

# 9. Asset Requirements

## Characters

- Young Modi sprite
- Adult Modi sprite
- NPC citizens
- Officials
- Mentors

## Backgrounds

- Tea stall
- Railway station
- Town streets
- Government office
- Parliament-style environment

## UI Assets

- Buttons
- Icons
- Dialogue boxes
- Progress bars

## Audio

- Background music
- Jump sound
- Collect sound
- UI click sound
- Quest completion sound

---

# 10. Development Milestones

## Phase 1: Foundation

- Setup Phaser project
- Create BootScene
- Create MenuScene
- Implement player movement

## Phase 2: Core Systems

- Collision system
- NPC interaction
- Dialogue system
- Quest system

## Phase 3: Level Development

- Tea Stall level
- Youth Exploration level
- Organization level
- Political Leadership level
- PM level

## Phase 4: Polish

- Animations
- Sound effects
- UI improvements
- Save/load functionality

## Phase 5: Testing

- Bug fixing
- Performance optimization
- Mobile compatibility testing

---

# 11. Future Enhancements

- Voice narration
- Multiple language support
- Achievement system
- Leaderboards
- Mobile touch controls
- Historical timeline gallery
- Educational quiz mode
