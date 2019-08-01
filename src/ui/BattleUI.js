import blessed from 'blessed';
import contrib from 'blessed-contrib';
import { emit, on } from '../dispatch';
import { debug } from '../utility';
import { store } from '../main';

function BattleUI ()
{
  on('battle.start', this.start.bind(this));
  on('battle.update', this.update.bind(this));
  on('battle.player.start', this.enableControl.bind(this));
  
  this.widget = blessed.box();
  this.enabled = false;

  this.log = contrib.log({ 
      parent: this.widget
    , interactive: false
    , fg: "green"
    , label: 'Battle Log'      
    , right: 0
    , height: '100%'
    , width: '40%'
    , tags: true      
    , border: {type: 'line', fg: 'cyan'} 
  });

  this.enemy = blessed.box({
      parent: this.widget
    , interactive: false
    , label: 'Enemy'
    , left: 0
    , top: 0
    , height: 20
    , width: '30%'
    , tags: true
    , border: {type: 'line', fg: 'red'}
  });

  this.enemyText = blessed.text({
      parent: this.enemy
    , interactive: false
    , left: 0
    , top: 0
    , height: 10
    , width: 20
    , tags: true
    , content: 'the enemy guy' 
  });

  this.player = blessed.text({
      parent: this.widget
    , label: 'Player'
    , interactive: false
    , left: '30%'
    , height: 10
    , width: '30%'
    , tags: true
    , border: {type: 'line', fg: 'red'}
    , content: 'the player guy' 
  });

  this.list = blessed.list({
      parent: this.widget
    , bottom: 0
    , left: 0
    , width: '50%'
    , height: 6
    , label: 'abilities'
    , keys: true
    , items: []
    , border: {
        type: 'line'
      }
    , style: {
        fg: 'white',
        border: {
          fg: '#ffffff'
        },
        selected: {
          fg: 'black',
          bg: 'white'
        },
        item: {
          fg: '#ffffff'
        }
      }
  });

  // Handle input selection
  this.list.on('select', cb => {
    if (!this.enabled) return;
    
    const ability = cb.content;
    this.log.log(`Using ${ability}.`);
    
    this.disableControl();
    emit('battle.player.finish', { ability }); // Uses ability for player
  });
}


BattleUI.prototype.enableControl = function()
{
  this.enabled = true;
}


BattleUI.prototype.disableControl = function() 
{
  this.enabled = false;
}


BattleUI.prototype.start = function()
{
  this.log.logLines = []; // clear the log

  const player = store.getState().player.character;
  const enemy = store.getState().enemy.character;

  const abilities = player.abilities;

  const choices = abilities.map(ability => {
    return ability.name;
  });

  this.list.setItems(choices);

  this.update({
    text: `you encountered a ${enemy.name}!`
  });
}


BattleUI.prototype.update = function(params)
{
  debug('BattleUI: update');

  const player = store.getState().player.character;
  const enemy = store.getState().enemy.character;

  let enemyInfo = `${enemy.name}\n health: ${enemy.health}/${enemy.defaultHealth}`;
  this.enemyText.setContent(enemyInfo);

  let playerInfo = `${player.name}\n health: ${player.health}/${player.defaultHealth}`;
  this.player.setContent(playerInfo);

  this.log.log(params.text);
}

export default BattleUI;