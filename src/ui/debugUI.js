import blessed from 'blessed';
import contrib from 'blessed-contrib';
import dispatch from '../dispatch';

function DebugUI () 
{  
  dispatch.on('debug.log', event => {
    this.log.log(event.text);
  });

  this.widget = blessed.box();

  this.log = contrib.log({ 
      parent: this.widget
    , fg: "green"
    , label: 'DEBUG'      
    , right: 0
    , height: "100%"
    , width: 30
    , tags: true      
    , border: {type: "line", fg: "yellow"} 
  });
}

export default DebugUI;