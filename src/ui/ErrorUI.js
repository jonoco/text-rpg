import blessed from 'blessed';

function ErrorUI () 
{
  this.widget = blessed.text({
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    label: 'error',
    content: 'something bad happened',
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

export default ErrorUI;