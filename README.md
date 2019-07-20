# Text RPG
Console text-based RPG engine.

## Changelog


## Dev notes

### Lifecycle
1. main 
    1. initializes Game object
    2. calls Game.start()
2. Game.constructor() 
    1. initializes Player object
    2. initializes game parameters
    3. initializes null GameState 
    4. initializes Battle object
    5. initializes blessed.screen object
    6. setup global input hooks
    7. initializes UI screen objects
    8. subscribe all screen event hooks
3. Game.start()
    1. give player starting equipment
    2. start game cycle
        1. change GameState to move
4. game cycle
    1. wait for input from current screen
    2. Game handles event listening
    3. call state change from UI widgets
    4. Game handles logic for state changes


### UI Communication
The Game object handles primary game logic, delegating down when necessary. Data is passed directly by reference into UI objects, while UI objects pass data back up to the Game object through the event system.

### Abilities
Abilities are a generalized system to modify characters. They can improve character stats, or provide new attacks or spells. Abilities can be passive, or active. Active spells can be used in World or Battle. Abilities are separated into categories, e.g., spells, attacks.

#### Upgrading abilities
Abilities are improved over time with use, eventually rising into a mastered state. Mastering abilities can unlock new abilities.

#### Learning abilities
Abilities can be learned through behavior, taught, or by mastering other abilities.

#### Using abilities
Battle abilities are displayed in the battle screen. Every action signifies an ability, e.g., attack, escape, cast fireball, etc. This means all actions are actually based on abilities, and those actions can improve with use. The most relevant analogy is the Materia system used in FF7, where all behavior is based on Materia, and using that Materia improves it over time.

Abilities may deplete or recover resources, such as health or stamina.

##### Domain of concern
When abilities are used, they first poll the user's stats, augmenting the ability stats for damage or efficacy, etc., then it polls the target's stats, where it's augmented again for resistance, dodging, etc. The final affect is passed to the user and target.

This focuses the domain of concern on the ability, rather than the character to manage a variety of abilities, allocating the logic handling to individual abilities, but improving extensibility of abilities. 

Rather than calculate the effects of individual abilities, Characters pass relevant stat info to the ability, such as their attributes and the sum of their passive ability effects.

For example, a user uses a PetrificationAbility on a target. The ability calculates the user's power and accuracy. Then it calculates the target's defence and evasion. Then it reports the success or failure to the user and target, passing damage and effect to the target if appropriate. If the petrification is successful, it grants a new passive ability to the target, PetrifiedAbility.

### Leveling up stats
Rather than use a tradition attribute-based upgrade system, the game uses an abilities-based system, where behavior alters abilities, which improves abilities over time, e.g., using a sword improves strength and sword abilities, using spells improves spell casting.

#### Attributes 
Attributes will exist, but are not modified directly, but indirectly through abilities and behavior, e.g., swinging a sword improves strength, being hit improves endurance, using speed-based abilties improves agility.

#### Strength vs Magic
Using spells improves mana pool and spell power, while using strength-based weapons, like hammers or swords, improves endurance and attack power, leading to gradual improvements in health. By avoiding physical weapons, spell casters will gradually grow in power while not gaining health, thereby requiring them to rely on magic for protection.

## Todo
 - [ ] build blessed-based screens
     + [x] World movement screen
     + [x] Battle screen
     + [x] Inventory screen
     + [x] Equipment screen
     + [ ] Stats/upgrade screen
     + [x] Postbattle rewards screen
     + [ ] Abilities screen
 - [x] create debug UI widget 
    + [ ] allow toggling debug widget


