import blessed from 'blessed';
import contrib from 'blessed-contrib';
import { emit, on } from '../dispatch';
import { store } from '../main';
import { levelupSkill } from '../actions/characterActions';

/**
 * Allows user to create name and distribute skills points of a new character.
 */
class CharCreationUI extends blessed.box
{
  constructor(props)
  {
    super(props);

    this.points = 20;
    this.skills = {
        strength: 10
      , constitution: 10
      , dexterity: 10
      , intelligence: 10
      , wisdom: 10
      , charisma: 10
    }

    this.controls = blessed.text({
        parent: this
      , top: 0
      , left: 0
      , width: '100%'
      , height: '10%'
      , tags: true
      , label: 'Controls'
      , border: { type: 'line', fg: 'white' }
      , content: `use arrows to move and distribute points`
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
     , columnSpacing: 5
     , columnWidth: [20, 10, 10]
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

      const index = this.skillTable.rows.selected;
      const skill = Object.keys(this.skills)[index];

      // store.dispatch(levelupSkill('player', skill))
      // this.update();
    });

    // Update info when scrolling equipment table
    this.skillTable.rows.key(['up', 'down'], () => { this.updateInfo() });
    this.skillTable.rows.key(['left'], () => { this.decPoint() });
    this.skillTable.rows.key(['right'], () => { this.incPoint() });
  }

  /**
   * Return cost to upgrade from current skill.
   */
  upgradeCost(level)
  {
    switch (level) {
      case 8:
        return 1;
      case 9:
        return 2;
      case 10:
        return 1;
      case 11:
        return 2;
      case 12:
        return 3;
      case 13:
        return 5;
      case 14:
        return 7;
      case 15:
        return 9;
      case 16:
        return 12;
      case 17:
        return 16;
      default:
        return 0;
    }
  }


  incPoint()
  {
    const index = this.skillTable.rows.selected;
    const skill = Object.keys(this.skills)[index];
    const upgradeCost = this.upgradeCost(this.skills[skill]);

    if (upgradeCost <= this.points) {
      ++this.skills[skill];
      this.points -= upgradeCost;
    }

    this.update()
  }


  decPoint()
  {
    const index = this.skillTable.rows.selected;
    const skill = Object.keys(this.skills)[index];

    if (this.skills[skill] === 8)
      return;

    const refundValue = this.upgradeCost(this.skills[skill] - 1);

    --this.skills[skill];
    this.points += refundValue;

    this.update()
  }


  open()
  {
    this.update();
    this.skillTable.focus();
  }


  update()
  {
    const entries = Object.keys(this.skills).map(skill => {
      return [
        skill, this.skills[skill], this.upgradeCost(this.skills[skill])
      ]
    })

    this.skillTable.setData({ 
      headers: ['skill', 'level', 'cost'], 
      data: entries
    });

    this.updateInfo();
  }


  /*
    Update info with highlighted item
  */
  updateInfo ()
  {
    if (this.detached) return;
      
    const index = this.skillTable.rows.selected;
    const skill = Object.entries(this.skills)[index];

    let infoContent = 'no skill found';
    if (skill)
    {
      infoContent = `points available: [${this.points}]\n\n`
        + `${skill[0]}\n\n`
        + `level: ${skill[1]}\n\n`
        ;
    }
    
    this.info.setContent(infoContent);
    this.screen.render();
  }
}

export default CharCreationUI;