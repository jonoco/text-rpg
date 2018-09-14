import blessed from 'blessed';

function GameOverUI () 
{
  this.widget = blessed.text({
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    label: 'Game over',
    content: 'Game over!',
    tags: true,
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
}

export default GameOverUI;