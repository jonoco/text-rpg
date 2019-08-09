import blessed from 'blessed';
import contrib from 'blessed-contrib';
import { emit, on } from '../dispatch';
import { debug } from '../utility';
import { store } from '../main';
import { getCharacterActiveAbilities, getCharacterDefaultHealth } from '../selectors';

export default class BattleUI extends blessed.box
{
  constructor(props)
  {
    super(props);

    on('battle.start', this.start.bind(this));
    on('battle.update', this.update.bind(this));
    on('battle.player.start', this.enableControl.bind(this));
    
    this.enabled = false;

    this.log = contrib.log({ 
        parent: this
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
        parent: this
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
        parent: this
      , label: 'Player'
      , interactive: false
      , left: '30%'
      , height: 20
      , width: '30%'
      , tags: true
      , border: {type: 'line', fg: 'red'}
      , content: 'the player guy' 
    });

    this.list = blessed.list({
        parent: this
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


  enableControl()
  {
    this.enabled = true;
    this.update();
  }


  disableControl() 
  {
    this.enabled = false;
    this.update();
  }


  start()
  {
    this.log.logLines = []; // clear the log

    const player = store.getState().player.character;
    const enemy = store.getState().enemy.character;

    const abilities = getCharacterActiveAbilities(store.getState(), player.character);

    const choices = abilities.map(ability => {
      return ability.name;
    });

    this.list.setItems(choices);

    this.update({
      text: `you encountered a {red-fg}${enemy.name}!{/}`
    });
  }


  update(params)
  {
    debug('BattleUI: update');

    const player = store.getState().player.character;
    const enemy = store.getState().enemy.character;
    const enemyDefaultHealth = getCharacterDefaultHealth(store.getState(), 'enemy');
    const playerDefaultHealth = getCharacterDefaultHealth(store.getState(), 'player');

    let enemyInfo = `${enemy.name} {cyan-fg}${!this.enabled ? '<' : ''}{/}
      \n health: {white-fg}${enemy.health}{/}/{white-fg}${enemyDefaultHealth}{/}
      `;
    this.enemyText.setContent(enemyInfo);

    let playerInfo = `${player.name} {cyan-fg}${this.enabled ? '<' : ''}{/}
      \n health: {white-fg}${player.health}{/}/{white-fg}${playerDefaultHealth}{/}
      `;
    this.player.setContent(playerInfo);

    if (params)
      this.log.log(params.text);

    this.screen.render();
  }
}
