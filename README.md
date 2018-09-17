# Text RPG
Console text-based RPG engine.

## Dev notes

### UI Communication
The Game object handles primary game logic, delegating down when necessary. Data is passed directly by reference into UI objects, while UI objects pass data back up to the Game object through the event system.

### Leveling up stats
Rather than use a tradition attribute-based upgrade system, the game uses an abilities-based system, where behavior alters abilities, which improves abilities over time, e.g., using a sword improves strength and sword abilities, using spells improves spell casting.

#### Abilities
Abilities are a generalized system to modify characters. They can improve character stats, or provide new attacks or spells. Abilities can be passive, or active. Active spells can be used in World or Battle. Abilities are separated into categories, e.g., spells, attacks.

Abilities are improved over time with use, eventually rising into a mastered state. Mastering abilities can unlock new abilities.

Abilities can be learned through behavior, taught, or by mastering other abilities.

#### Attributes 
Attributes will exist, but are not modified directly, but indirectly through abilities and behavior, e.g., swinging a sword improves strength, being hit improves endurance, using speed-based abilties improves agility.

#### Strength vs Magic
Using spells improves mana pool and spell power, while using strength-based weapons, like hammers or swords, improves endurance and attack power, leading to gradual improvements in health. By avoiding physical weapons, spell casters will gradually grow in power while not gaining health, thereby requiring them to rely on magic for protection.

## Todo
 - build blessed-based screens
     + [x] World movement screen
     + [x] Battle screen
     + [x] Inventory screen
     + [x] Equipment screen
     + [ ] Stats/upgrade screen
     + [x] Postbattle rewards screen