import blessed from 'blessed';
import contrib from 'blessed-contrib';
import dispatch from '../dispatch';
import { store } from '../main';


class AbilityUI extends blessed.box
{
  constructor(props)
  {
    super(props);

    dispatch.on('abilities.update', this.updateTable.bind(this));

    this.controls = blessed.text({
        parent: this
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
       parent: this
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
        parent: this
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
        parent: this
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
      if (this.detached) return;

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
  updateInfo ()
  {
    if (this.detached === 'undefined') return;
      
    const character = store.getState().player.character;

    const index = this.abilityTable.rows.selected;
    const ability = character.abilities[index];

    let infoContent = 'no ability found';
    if (ability)
    {
      infoContent = `${ability.name}\n\n`
        + `${ability.description}\n\n`
        + `damage: ${ability.damage}\n\n`
        ;
    }
    
    this.info.setContent(infoContent);
    this.screen.render();
  }

  /*
    Update abilities table
  */
  updateTable()
  {
    const character = store.getState().player.character;

    const abilityContent = character.abilities.map(ability => {
      const text = ability.name;
      return [text];
    });

    this.abilityTable.setData({ 
      headers: ['ability'], 
      data: abilityContent
    });

    this.updateInfo();
  }
}

export default AbilityUI;