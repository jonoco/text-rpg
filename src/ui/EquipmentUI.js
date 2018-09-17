import blessed from 'blessed';
import contrib from 'blessed-contrib';
import dispatch from '../dispatch';

function EquipmentUI()
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

  this.equipment = contrib.table({
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
   , label: 'Equipment'
   , border: { type: 'line', fg: 'cyan' }
   , columnSpacing: 10
   , columnWidth: [10, 30]
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

  // unequip item
  this.equipment.rows.on('select', node => {
    if (this.widget.detached || this.character === 'undefined') return;

    const index = this.equipment.rows.selected;
    const slot = Object.keys(this.character.equipment)[index];
    
    this.character.unequipItem(slot);

    this.updateEquipment();
  });

  // Update info when scrolling equipment table
  this.equipment.rows.key(['up', 'down'], () => { this.updateInfo() });

  this.equipment.rows.key('i', () => { dispatch.emit('inventory.open') });
  this.equipment.rows.key('c', () => { dispatch.emit('equipment.close') });
}


/*
  Update info with highlighted item and currently equipped item
*/
EquipmentUI.prototype.updateInfo = function()
{
  if (this.widget.detached || this.character === 'undefined') return;
    
  const index = this.equipment.rows.selected;
  const slot = Object.keys(this.character.equipment)[index];
  const item = this.character.getItemFromSlot(slot);

  let infoContent = `${item ? item.name : 'no item equipped'}`;
  
  this.info.setContent(infoContent);
  this.widget.screen.render();
}


/*
  Update equipment list
*/
EquipmentUI.prototype.updateEquipment = function()
{
  if (!this.character) return dispatch.emit('error', {text: 'no character selected'});

  const equipmentContent = Object.keys(this.character.equipment).map(slot => {
    const item = this.character.getItemFromSlot(slot);
    const text = item ? item.name : 'empty';
    return [slot, text];
  });

  this.equipment.setData({ 
    headers: ['slot', 'item'], 
    data: equipmentContent
  });

  this.updateInfo();
}


/*
  Set referencing character
*/
EquipmentUI.prototype.setCharacter = function(character)
{
  this.character = character;
  
  this.updateEquipment();
}

export default EquipmentUI;