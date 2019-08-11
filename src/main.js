import { applyMiddleware, createStore, combineReducers } from 'redux';
import createCLILogger from 'redux-cli-logger'

import game from './reducers/GameReducer';
import battle from './reducers/BattleReducer';
import { player, enemy } from './reducers/CharacterReducer';
import map from './reducers/MapReducer';

import { debug } from './utility';
import { Game } from './Game';

const middleware = [];

const loggerOptions = {
  log: text => debug(text, 'action')
};
const logger = createCLILogger(loggerOptions);
middleware.push(logger);


const reducer = combineReducers({
    game
  , battle
  , player
  , enemy
  , map
});
export const store = createStore(reducer, applyMiddleware(...middleware));


const main = async () => {
  const game = new Game();
  
  await game.load();

  game.start();
};


main();
