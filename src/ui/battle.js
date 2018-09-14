import blessed from 'blessed';
import contrib from 'blessed-contrib';
import dispatch from '../dispatch';

function BattleUI ()
{
  dispatch.on('battle.start', this.start.bind(this));
  dispatch.on('battle.update', this.update.bind(this));

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

  this.enemy = blessed.text({
      parent: this.widget
    , label: 'Enemy'
    , left: 0
    , height: 10
    , width: 20
    , tags: true
    , border: {type: 'line', fg: 'red'}
    , content: 'the enemy guy' 
  });

  this.player = blessed.text({
      parent: this.widget
    , label: 'Player'
    , left: 20
    , height: 10
    , width: 20
    , tags: true
    , border: {type: 'line', fg: 'red'}
    , content: 'the player guy' 
  });

  const choices = {
    attack: { name: 'first things first' },
    escape: { name: 'escape' }
  };

  this.list = blessed.list({
      parent: this.widget
    , bottom: 0
    , left: 0
    , width: '50%'
    , height: 6
    , label: 'list'
    , keys: true
    , items: Object.keys(choices)
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
    const key = cb.content;
    this.log.log(key);

    switch (key)
    {
      case 'attack':
        dispatch.emit('battle.playerAttack');
        break;
      case 'escape':
        dispatch.emit('exit');
        break;
    }
  });
}


BattleUI.prototype.start = function(event)
{
  this.log.logLines = []; // clear the log

  this.update(event);
}


BattleUI.prototype.update = function(event)
{
  const enemy = event.enemy;
  const player = event.player;

  let enemyInfo = `${enemy.name}\n health: ${enemy.health}`;
  this.enemy.setContent(enemyInfo);

  let playerInfo = `${player.name}\n health: ${player.health}`;
  this.player.setContent(playerInfo);

  this.log.log(event.text);
}

export default BattleUI;