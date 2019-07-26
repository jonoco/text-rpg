import blessed from 'blessed';
import contrib from 'blessed-contrib';
import dispatch from '../dispatch';

function DebugUI () 
{  
  

  this.widget = blessed.box();

  this.log = contrib.log({ 
      parent: this.widget
    , fg: "green"
    , label: 'DEBUG'      
    , right: 0
    , height: "90%"
    , width: "100%"
    , tags: true      
    , border: {type: "line", fg: "yellow"} 
  });
  
  dispatch.on('debug.log', event => {
    event.text.split('\n').forEach(str => {
      this.log.log(str);  
    });
  });
}

export default DebugUI;