import blessed from 'blessed';
import contrib from 'blessed-contrib';
import dispatch from '../dispatch';

export default class DebugUI extends blessed.box
{  
  constructor(props)
  {
    super(props);

    this.content = {};
    this.index = 0;

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
      label: 'DEBUG',
      border: 'line',
      content: '',
      keys: true,
      mouse: true,
      vi: true,
      interactive: true,
      alwaysScroll: true,
      scrollbar: {
        ch: ' ',
        inverse: true,
        style: {
          bg: 'blue'
        }
      }
    });

    this.log.key(['right'], () => { 
      this.index++;
      this.index = this.index >= Object.keys(this.content).length ? 0 : this.index;

      this.update();
    });

    this.log.key(['left'], () => { 
      this.index--;
      this.index = this.index < 0 ? Object.keys(this.content).length - 1 : this.index;

      this.update();
    });
    
    dispatch.on('debug.log', event => {
      let { level, text } = event;
      level = level || 'log';

      if (!this.content[level])
        this.content[level] = '';

      let content = this.content[level];
      text.split('\n').forEach(str => {
        content += `\n${str}`;
      });
      this.content[level] = content;
    });
  }


  update()
  {
    const level = Object.keys(this.content)[this.index];
    this.log.setContent(this.content[level]);
    this.log.setLabel(`DEBUG - ${level}`);

    this.log.screen.render();
  }
}
