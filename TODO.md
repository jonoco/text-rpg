## Todo
 - [x] build blessed-based screens
     + [x] World movement screen
     + [x] Battle screen
     + [x] Inventory screen
     + [x] Equipment screen
     + [x] Postbattle rewards screen
     + [x] Abilities screen
 - [x] create debug UI widget 
    + [x] allow toggling debug widget
 - [x] wrap ui code in Screen object 
 - [x] revise Abilities and Skills system
    + [x] implement Skills system
    + [x] adjust Abilities system
    + [x] display Skills and Abilites in AbilityUI
 - [x] revise Battle system
    + [x] create turn-based mechanic
 - [x] convert to message passing model for module communication
 - [x] implement Redux for state management
    - [x] game state
    - [x] battle state
    - [x] inventory state
    - [x] character state
- [x] make debug ui scrollable
- [x] revise item system
    - [x] revise equipment screen
    - [x] fix item equiping
    - [x] allow equipped items to affect ability and skills
- [x] implement skill system
    - [x] allow skills to modify abilities
- [ ] create accounting module
- [x] allow filtering the debug ui
- [x] allow map to influence gameplay
    - [x]  no crossing mountains
    - [x]  no crossing deep water
    - [x]  different enemies in by environment
- [ ] create world clock
- [x] move map state to a reducer
- [x] add colors to world log
- [ ] overhaul battle module
    - [ ] handle asynchronous behavior predictably
    - [ ] encapulate character behavior ; simplify player/enemy handling
    - [ ] handle multiple enemies & players

## Bugs
- [x] reference to combatants not updating state during combat

