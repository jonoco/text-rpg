import blessed from 'blessed';
import contrib from 'blessed-contrib';
import { emit, on } from '../dispatch';
import { store } from '../main';
import { equipItem } from '../actions/inventoryActions';
import { Item } from '../Item';

class EquipmentUI extends blessed.box 
{
  constructor(props)
  {
    super(props);

    this.isShowingInfo = true;
    
    this.controls = blessed.text({
        parent: this
      , top: 0
      , left: 0
      , width: '100%'
      , height: '10%'
      , tags: true
      , label: 'Controls'
      , border: { type: 'line', fg: 'white' }
      , content: `c to close, arrows to move, enter to equip, t to toggle info`
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
     , columnWidth: [25, 8, 8]
    });

    this.equipment = contrib.table({
       parent: this
     , top: '55%'
     , left: '50%'
     , width: '50%'
     , height: '45%'
     , fg: 'white'
     , selectedFg: 'white'
     , selectedBg: 'black'
     , label: 'Equipment'
     , border: { type: 'line', fg: 'cyan' }
     , columnSpacing: 10
     , columnWidth: [10, 30]
    });

    this.info = blessed.text({
        parent: this
      , top: '10%'
      , left: '50%'
      , width: '50%'
      , height: '45%'
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

    on('equipment.open', () => {
      // Toggle equipment and info
      // if (this.isShowingInfo) {
      //   this.remove(this.equipment);
      //   this.append(this.info);
      // } else {
      //   this.remove(this.info);
      //   this.append(this.equipment);
      // }
      
      this.inventory.focus();
      this.updateEquipment();
      this.updateInventory();
    });

    on('equipment.update', this.updateInventory.bind(this));

    // events from inside Table widget are not bubbled up
    // equip item from inventory
    this.inventory.rows.on('select', node => {
      if (this.detached) return;

      const player = store.getState().player;

      const index = this.inventory.rows.selected;
      const item = player.inventory.items[index];


      // Try to equip item
      store.dispatch(equipItem('player', item));

      // if (item && !this.character.equipItem(item))
      // {
      //   const message = 'Cannot swap item, no room to equip\n\nUnequip an item first';
      //   this.message.display(message, 0);
      // }
      this.updateInventory();
      this.updateEquipment();
      this.screen.render();
    });

    // Update info when scrolling inventory table
    this.inventory.rows.key(['up', 'down'], () => { this.updateInfo() });
    //this.inventory.rows.key(['t'], () => { this.toggleInfo() })
  }


  toggleInfo()
  {
    this.isShowingInfo = !this.isShowingInfo;

    if (this.isShowingInfo) {
      this.remove(this.equipment);
      this.append(this.info);
    } else {
      this.remove(this.info);
      this.append(this.equipment);
    }

    this.screen.render();
  }


  /*
    Update info with highlighted item and currently equipped item
  */
  updateInfo()
  {
    if (this.detached) return;

    const player = store.getState().player;
      
    const index = this.inventory.rows.selected;
    const item = player.inventory.items[index];
    
    let infoContent = '';
    if (item) {
      infoContent = `name: ${item.name}`;  
      Object.keys(item.attributes).forEach(attr => {
        if (item.attributes[attr])
          infoContent += `\n${attr}: ${item.attributes[attr]}`;
      });
    }
    
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
    if (!player) emit('error', {text: 'Error|EquipmentUI: no player found'});

    let inventoryContent = [];
    
      inventoryContent = player.inventory.items.map(item => {
        const slot = player.inventory[item.slot];
        const equipped = slot !== null && slot === item.id ? 'equipped' : '---';
        return [item.name, item.slot, equipped];
      });  
    

    this.inventory.setData({ 
      headers: ['item', 'slot', 'equipped'], 
      data: inventoryContent
    });

    this.updateInfo();
  }

  updateEquipment()
  {
    if (this.detached) return;

    const player = store.getState().player;
    if (!player) emit('error', {text: 'Error|EquipmentUI: no player found'});

    let inventoryContent = [];
    for (let slot of Item.ItemSlots) {
      const item = player.inventory.items.find(i => player.inventory[slot] == i.id);
      inventoryContent.push([
        slot,
        item ? item.name : '---'
      ]);
    }

    this.equipment.setData({ 
      headers: ['slot', 'item'], 
      data: inventoryContent
    });
  }
}


export default EquipmentUI;