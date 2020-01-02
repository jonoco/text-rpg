import blessed from 'blessed';
import contrib from 'blessed-contrib';
import { emit, on } from '../dispatch';
import { store } from '../main';
import { levelupSkill } from '../actions/characterActions';

class SkillUI extends blessed.box
{
  constructor(props)
  {
    super(props);

    this.controls = blessed.text({
        parent: this
      , top: 0
      , left: 0
      , width: '100%'
      , height: '10%'
      , tags: true
      , label: 'Controls'
      , border: { type: 'line', fg: 'white' }
      , content: `c to close, arrows to move, enter to unequip, i to open inventory`
    });

    this.skillTable = contrib.table({
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
     , label: 'Skills'
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

    on('skills.open', event => { this.open(event) });

    // Upgrade skill on select
    this.skillTable.rows.on('select', node => {
      if (this.detached) return;

      // const index = this.skillTable.rows.selected;
      // const skill = store.getState().player.character.skills[index];

      // store.dispatch(levelupSkill('player', skill))
      // this.update();
    });

    // Update info when scrolling equipment table
    this.skillTable.rows.key(['up', 'down'], () => { this.updateInfo() });
  }

  open()
  {
    this.update();
    this.skillTable.focus();
  }

  update()
  {
    const character = store.getState().player.character;

    if (!character.skills) return emit('error', {
      text: `SkillUI - no skills found for ${character.name}`
    });

    this.skillTable.setData({ 
      headers: ['skill', 'level'], 
      data: Object.entries(character.skills)
    });

    this.updateInfo();
  }
  /*
    Update info with highlighted item
  */
  updateInfo ()
  {
    if (this.detached) return;
      
    const character = store.getState().player.character;

    const index = this.skillTable.rows.selected;
    const skill = Object.entries(character.skills)[index];

    let infoContent = 'no skill found';
    if (skill)
    {
      infoContent = `${skill[0]}\n\n`
        + `level: ${skill[1]}\n\n`
        ;
    }
    
    this.info.setContent(infoContent);
    this.screen.render();
  }
}

export default SkillUI;