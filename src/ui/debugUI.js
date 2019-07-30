import blessed from 'blessed';
import contrib from 'blessed-contrib';
import dispatch from '../dispatch';

export default class DebugUI extends blessed.box
{  
  constructor(props)
  {
    super(props);

    this.log = blessed.box({
      parent: this,
      scrollable: true,
      left: 'center',
      top: 'center',
      width: '90%',
      height: '90%',
      style: {
        bg: 'black'
      },
      border: 'line',
      content: '',
      keys: true,
      mouse: true,
      vi: true,
      alwaysScroll: true,
      scrollbar: {
        ch: ' ',
        inverse: true
      }
    });
    
    dispatch.on('debug.log', event => {
      event.text.split('\n').forEach(str => {
        this.log.setContent(`${this.log.content}\n${str}`);
      });
    });
  }
}
