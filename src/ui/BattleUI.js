import blessed from 'blessed';
import contrib from 'blessed-contrib';
import dispatch from '../dispatch';
import { AbilityUse } from '../abilities/AbilityBase';

function BattleUI ()
{
  dispatch.on('battle.start', this.start.bind(this));
  dispatch.on('battle.update', this.update.bind(this));
  dispatch.on('battle.log', event => {
    this.log.log(event.text);
  });

  this.widget = blessed.box();

  this.log = contrib.log({ 
      parent: this.widget
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
    , left: '30%'
    , height: 10
    , width: '30%'
    , tags: true
    , border: {type: 'line', fg: 'red'}
    , content: 'the player guy' 
  });

  // const choices = {
  //   attack: { name: 'first things first' },
  //   escape: { name: 'escape' }
  // };

  this.list = blessed.list({
      parent: this.widget
    , bottom: 0
    , left: 0
    , width: '50%'
    , height: 6
    , label: 'list'
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
          fg: 'blue'
        },
        item: {
          fg: '#ffffff'
        }
      }
    , mouse: true
  });

  // Handle input selection
  this.list.on( 'select', cb => {
    const ability = cb.content;
    this.log.log(`Using ${ability}.`);

    dispatch.emit('battle.useAbility', { ability }); // Uses ability for player
  });
}


BattleUI.prototype.start = function(event)
{
  this.log.logLines = []; // clear the log

  // Get the player's active abilities
  const activeAbilities = event.player.abilities.filter(ability => {
    return ability.activation === AbilityUse.active;
  });

  const choices = activeAbilities.map(ability => {
    return ability.name;
  });

  this.list.setItems(choices);

  this.update(event);
}


BattleUI.prototype.update = function(event)
{
  const enemy = event.enemy;
  const player = event.player;

  let enemyInfo = `${enemy.name}\n health: ${enemy.health}/${enemy.defaultHealth}`;
  this.enemyText.setContent(enemyInfo);

  let playerInfo = `${player.name}\n health: ${player.health}/${player.defaultHealth}`;
  this.player.setContent(playerInfo);

  this.log.log(event.text);
}

export default BattleUI;