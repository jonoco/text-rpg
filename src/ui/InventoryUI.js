import blessed from 'blessed';
import contrib from 'blessed-contrib';
import dispatch from '../dispatch';

function InventoryUI()
{
  this.widget = blessed.box();

  dispatch.on('inventory.open', event => {
    this.inventory.setData({ 
      headers: ['col1', 'col2', 'col3'], 
      data: [ 
        [1, 2, 3], 
        [4, 5, 6] 
      ]
    });
  });

  this.inventory = contrib.table({
     parent: this.widget
   , top: 0
   , left: 0
   , width: '30%'
   , height: '100%'
   , keys: true
   , fg: 'white'
   , selectedFg: 'white'
   , selectedBg: 'blue'
   , interactive: true
   , label: 'Inventory'
   , border: { type: 'line', fg: 'cyan' }
   , columnSpacing: 10
   , columnWidth: [16, 12, 12]
  });

  this.info = blessed.text({
      parent: this.widget
    , top: 0
    , left: '30%'
    , width: '20%'
    , height: '100%'
    , label: 'Info'
    , content: ''
    , tags: true
    , border: { type: 'line' }
    , style: {
        fg: 'white',
        border: { fg: '#ffffff' },
        hover: { bg: 'green' }
      }
  });
}

export default InventoryUI;