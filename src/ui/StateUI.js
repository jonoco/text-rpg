import blessed from 'blessed';
import contrib from 'blessed-contrib';
import { emit, on } from '../dispatch';
import { store } from '../main';

class StateUI extends blessed.box
{
  constructor(props)
  {
    super(props);
    
    // tracks location in state during navigation
    this.location = [];
    // marks which entries in current location are objects
    this.directories = [];
    
    this.table = contrib.table({ 
       parent: this
     , keys: true
     , fg: 'white'
     , selectedFg: 'white'
     , selectedBg: 'blue'
     , interactive: true
     , label: 'State'
     , left: 0
     , width: '50%'
     , height: '100%'
     , border: {type: "line", fg: "cyan"}
     , columnSpacing: 10 //in chars
     , columnWidth: [16, 12, 12] /*in chars*/ 
   });


    this.info = blessed.text({
        parent: this
      , top: 0
      , right: 0
      , width: '50%'
      , height: '100%'
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

    this.table.rows.key(['right', 'return'], (node) => { 
      const isDirectory = this.directories[this.table.rows.selected];
      if (isDirectory) {
        this.location.push(this.table.rows.selected);
        this.updateTable();
      }
    });

    this.table.rows.key(['left'], () => { 
      if (this.location.length > 0) {
        this.location.pop();
      }
      this.updateTable();
    });

    this.table.rows.key(['up', 'down'], (node) => { this.updateInfo() });

    on('state.open', () => { 
      this.table.focus();
      this.updateTable(); 
    });
  }
  

  /*
    Update info with highlighted item
  */
  updateInfo ()
  { 
    const index = this.table.rows.selected;
    const isDirectory = this.directories[this.table.rows.selected];
    
    let address = 'root';

    let childState = Object.entries(store.getState());
    this.location.forEach(level => {
      const child = childState[level];
      address += `/${child[0]}`;
      childState = Object.entries(child[1]);
    });

    const data = `value: ${isDirectory ? '' : childState[index][1]}`;
    const content = `${address}\n\n${data}`;

    this.info.setContent(content);
    this.screen.render();
  }


  updateTable ()
  {
    let childState = Object.entries(store.getState());
    this.location.forEach(level => {
      const child = childState[level];

      childState = Object.entries(child[1]);
    });

    this.directories = [];
    const content = childState.map((child, i) => {
      const key = child[0];
      const data = child[1];

      if (typeof data === 'object' && !Array.isArray(data) && data !== null) {
        this.directories[i] = true;
        return [key, '+'];
      } else if (Array.isArray(data)) {
        if (data.length == 0) {
          this.directories[i] = false;          
          return [key, '']
        } else {
          this.directories[i] = true;          
          return [key, '+'];
        }
      } else {
        this.directories[i] = false;
        return [key, ''];
      }
    });
  
    this.table.setData({ 
        headers: ['property', 'dir']
      , data: content
    });

    this.updateInfo();
  }
}

export default StateUI;