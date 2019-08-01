import blessed from 'blessed';
import { emit, on } from '../dispatch';
import { store } from '../main';

export default class HelpUI extends blessed.box
{
  constructor(props)
  {
    super(props);
    
    this.text = blessed.text({
        parent: this
      , top: 0
      , left: 0
      , width: '100%'
      , height: '100%'
      , label: 'Help'
      , content: 'Help'
      , tags: true
      , interactive: true
      , align: 'center'
      , valign: 'middle'
      , border: {
          type: 'line'
        }
      , style: {
          fg: 'white'
        , border: {
            fg: '#ffffff'
          }
        }
    });

    const content = `
      a - show abilities screen
      s - show skill screen
      e - show equipment screen
      c - close current screen
      d - toggle debug log
      / - show application state
      \` - force back to world map

      press c to close 
    `;

    this.text.setContent(content);
  }
}