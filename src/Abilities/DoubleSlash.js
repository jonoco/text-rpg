import Slash from './Slash';

class DoubleSlash extends Slash
{  
  constructor(props)
  {
    super(props);

    this.name = 'Double Slash';
    
    this.addAbilityRequirement('Slash', 2);
  }


  get description()
  {
    const damage = this.getBaseDamage();
    return `Two slashes are more than one.
      \ndamage: ${damage.min} - ${damage.max}
    `
  }


  getBaseDamage()
  {
    const min = Math.floor(12 + this.uses * 0.3);
    const max = Math.floor(20 + this.uses * 0.3);
    return { min, max }; 
  }
}

export default DoubleSlash;