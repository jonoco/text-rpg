import { applyMiddleware, createStore, combineReducers } from 'redux';
import createCLILogger from 'redux-cli-logger'

import game from './reducers/GameReducer';
import battle from './reducers/BattleReducer';
import { player, enemy } from './reducers/CharacterReducer';

import { debug } from './utility';
import { Game } from './Game';

const middleware = [];

const loggerOptions = {
  log: debug
};
const logger = createCLILogger(loggerOptions);
middleware.push(logger);


const reducer = combineReducers({
    game
  , battle
  , player
  , enemy
});
export const store = createStore(reducer, applyMiddleware(...middleware));


const main = () => {
  const game = new Game();
  game.start();
};


main();
