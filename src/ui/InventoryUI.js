import blessed from 'blessed';
import contrib from 'blessed-contrib';
import dispatch from '../dispatch';
import { store } from '../main';

class InventoryUI extends blessed.box 
{
  constructor(props)
  {
    super(props);
    dispatch.on('inventory.update', this.updateInventory.bind(this));

    this.controls = blessed.text({
        parent: this
      , top: 0
      , left: 0
      , width: '100%'
      , height: '10%'
      , tags: true
      , label: 'Controls'
      , border: { type: 'line', fg: 'white' }
      , content: `c to close, arrows to move, enter to equip, e to open equipment`
    });

    this.inventory = contrib.table({
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
     , label: 'Inventory'
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

    // events from inside Table widget are not bubbled up
    // equip item from inventory
    this.inventory.rows.on('select', node => {
      if (this.detached || this.character === 'undefined') return;

      const index = this.inventory.rows.selected;
      const item = this.character.inventory[index];

      if (item && !this.character.equipItem(item))
      {
        const message = 'Cannot swap item, no room to equip\n\nUnequip an item first';
        this.message.display(message, 0);
      }
      this.updateInventory();
    });

    // Update info when scrolling inventory table
    this.inventory.rows.key(['up', 'down'], () => { this.updateInfo() });

    this.inventory.rows.key('e', () => { dispatch.emit('equipment.open') });
    this.inventory.rows.key('a', () => { dispatch.emit('abilities.open') });
    this.inventory.rows.key('c', () => { dispatch.emit('inventory.close') });
  }


  /*
    Update info with highlighted item and currently equipped item
  */
  updateInfo()
  {
    if (this.detached) return;

    const player = store.getState().player;
      
    const index = this.inventory.rows.selected;
    const selectedItem = player.inventory.items[index];
    
    let infoContent = 'no information';  
    
    this.info.setContent(infoContent);
    this.screen.render();
  }


  /*
    Update inventory list
  */
  updateInventory()
  {
    if (this.detached) return;

    const player = store.getState().player;
    if (!player) emit('error', {text: 'Error|InventoryUI: no player found'});

    // console.dir(player.inventory.items);

    let inventoryContent = [];

    if (player.inventory.items.length != 0)
    {
      inventoryContent = player.inventory.items.map(item => {
        return [item.name, item.type];
      });  
    }

    this.inventory.setData({ 
      headers: ['item', 'type'], 
      data: inventoryContent
    });

    this.updateInfo();
  }
}


export default InventoryUI;