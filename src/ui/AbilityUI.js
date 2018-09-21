import blessed from 'blessed';
import contrib from 'blessed-contrib';
import dispatch from '../dispatch';
import { AbilityEnvironment, AbilityUse } from '../abilities/AbilityBase';


function AbilityUI()
{
  this.widget = blessed.box();

  this.controls = blessed.text({
      parent: this.widget
    , top: 0
    , left: 0
    , width: '100%'
    , height: '10%'
    , tags: true
    , label: 'Controls'
    , border: { type: 'line', fg: 'white' }
    , content: `c to close, arrows to move, enter to unequip, i to open inventory`
  });

  this.abilityTable = contrib.table({
     parent: this.widget
   , top: '10%'
   , left: 0
   , width: '50%'
   , height: '90%'
   , keys: true
   , keyable: true
   , input: true
   , fg: 'white'
   , selectedFg: 'black'
   , selectedBg: 'white'
   , interactive: true
   , label: 'Abilities'
   , border: { type: 'line', fg: 'cyan' }
   , columnSpacing: 10
   , columnWidth: [30, 10]
  });

  this.info = blessed.text({
      parent: this.widget
    , top: '10%'
    , left: '50%'
    , width: '50%'
    , height: '90%'
    , label: 'Info'
    , content: ''
    , input: false
    , tags: true
    , border: { type: 'line' }
    , style: {
        fg: 'white',
        border: { fg: '#ffffff' }
      }
  });

  this.message = blessed.message({
      parent: this.widget
    , top: '25%'
    , left: '25%'
    , width: '50%'
    , height: '50%'
    , tags: true
    , align: 'center'
    , valign: 'middle'
    , border: { type: 'line' }
    , hidden: true
  });

  // TODO equip or unequip ability
  this.abilityTable.rows.on('select', node => {
    if (this.widget.detached || this.character === 'undefined') return;

    this.updateTable();
  });

  // Update info when scrolling equipment table
  this.abilityTable.rows.key(['up', 'down'], () => { this.updateInfo() });

  this.abilityTable.rows.key('i', () => { dispatch.emit('inventory.open') });
  this.abilityTable.rows.key('e', () => { dispatch.emit('equipment.open') });
  this.abilityTable.rows.key('c', () => { dispatch.emit('abilities.close') });
}


/*
  Update info with highlighted item
*/
AbilityUI.prototype.updateInfo = function()
{
  if (this.widget.detached || this.character === 'undefined') return;
    
  const index = this.abilityTable.rows.selected;
  const ability = this.character.abilities[index];

  let infoContent = 'no ability found';
  if (ability)
  {
    infoContent = `${ability.name}\n\n`
      + `${ability.description}\n\n`
      + (ability.baseDamage > 0 ? `damage: ${ability.baseDamage}\n\n` : '')
      + (ability.activation == AbilityUse.active ? `cost: ${ability.cost}\n\n` : '')
      + `level: ${ability.getProficiency()}\n\n`
      + `progress: ${ability.uses}\n\n`
      + `next level: ${ability.getRequiredProficiency()}`
      ;
  }
  
  this.info.setContent(infoContent);
  this.widget.screen.render();
}


/*
  Update abilities table
*/
AbilityUI.prototype.updateTable = function()
{
  if (!this.character) return dispatch.emit('error', {text: 'no character selected'});

  const abilityContent = this.character.abilities.map(ability => {
    const text = ability.name;
    const activation = ability.activation;
    return [text, activation];
  });

  this.abilityTable.setData({ 
    headers: ['ability', 'use'], 
    data: abilityContent
  });

  this.updateInfo();
}


/*
  Set referencing character
*/
AbilityUI.prototype.setCharacter = function(character)
{
  this.character = character;
  
  this.updateTable();
}

export default AbilityUI;