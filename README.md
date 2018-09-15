# Text RPG
Console text-based RPG engine.

## Dev notes

### UI Communication
The Game object handles primary game logic, delegating down when necessary. Data is passed directly by reference into UI objects, while UI objects pass data back up to the Game object through the event system.

## Todo
 - build blessed-based screens
     + World movement screen
     + Battle screen
     + Inventory screen
     + Stats/upgrade screen
     + Postbattle rewards screen