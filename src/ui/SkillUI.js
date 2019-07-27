import blessed from 'blessed';
import contrib from 'blessed-contrib';
import { emit, on } from '../dispatch';
import { store } from '../main';

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

    // TODO equip or unequip skill
    this.skillTable.rows.on('select', node => {
      if (this.detached || this.character === 'undefined') return;

      this.updateTable();
    });

    // Update info when scrolling equipment table
    this.skillTable.rows.key(['up', 'down'], () => { this.updateInfo() });

    this.skillTable.rows.key('i', () => { emit('inventory.open') });
    this.skillTable.rows.key('e', () => { emit('equipment.open') });
    this.skillTable.rows.key('c', () => { emit('skills.close') });
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

    const skillContent = character.skills.map(skill => {
      const text = skill.name;
      return [text];
    });

    this.skillTable.setData({ 
      headers: ['skill'], 
      data: skillContent
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
    const skill = character.skills[index];

    let infoContent = 'no skill found';
    if (skill)
    {
      infoContent = `${skill.name}\n\n`
        + `${skill.description}\n\n`
        + `level: ${skill.level}\n\n`
        ;
    }
    
    this.info.setContent(infoContent);
    this.screen.render();
  }
}

export default SkillUI;