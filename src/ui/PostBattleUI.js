import blessed from 'blessed';
import dispatch from '../dispatch';
import { store } from '../main';

function PostBattleUI () 
{
  dispatch.on('battle.poststart', this.update.bind(this));

  this.widget = blessed.text({
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    label: 'Reward',
    content: 'You beat that guy\npress space to continue',
    tags: true,
    interactive: true,
    align: 'center',
    valign: 'middle',
    border: {
      type: 'line'
    },
    style: {
      fg: 'white',
      border: {
        fg: '#ffffff'
      }
    }
  });

  this.widget.key('space', () => {
    if (this.widget.detached) return;

    dispatch.emit('map');
  });
}


PostBattleUI.prototype.update = function(event)
{
  const enemy = store.getState().enemy.character;

  let text = ``
    + `Victory!\n\n\n`
    + `You beat a ${enemy.name}\n\n\n`
    + `You earned ${event.experience} experience!\n\n`
    + `You received a ${event.item.name}!\n\n\n`
    + `press space to continue`
    ;

  this.widget.setContent(text);
  this.widget.screen.render();
}

export default PostBattleUI;