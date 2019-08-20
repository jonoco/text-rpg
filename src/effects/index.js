class Effect
{
  constructor()
  {
    this.name = 'NA';
    this.description = 'NA';
    this.turns = 0;
    this.count = 0;
  } 
}


export class Stunned extends Effect
{
  constructor(props)
  {
    super(props);

    this.name = 'Stun';
    this.description = 'Feeling dizzy and stupid.';
    this.turns = 2;
    this.count = 0;
  }
}


export class Poisoned extends Effect
{
  constructor(props)
  {
    super(props);
    
    this.name = 'Poison';
    this.description = 'Feeling like you were bit by Gary Busey.';
    this.turns = 3;
    this.count = 0;
  }
}