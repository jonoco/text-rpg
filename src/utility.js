import { _DEBUG_ } from './constants';
import { emit } from './dispatch'; 


/*
  Returns random int from [min, max)
*/
export function getRandomInt (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}


/*
  Returns random choice from array
*/
export function getRandomChoice(array) {
  return array[getRandomInt(0, array.length)];
}


/**
 * Prints debug message to DebugUI
 * @param  {string} text  Text to print
 * @param  {string} level Level to log message to - default is log
 */
export function debug(text, level) {
  if (_DEBUG_) {
    emit('debug.log', { text, level });
  }
}


/*
  Prints formatted console message
*/
export const message = (text) => {
  console.log(text);
}


/*
  Clear terminal
*/
export function clearScreen() {
  console.log('\x1Bc'); // Clear Terminal
}