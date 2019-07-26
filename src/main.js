import { applyMiddleware, createStore, combineReducers } from 'redux';
import logger from 'redux-logger';

import game from './reducers/GameReducer';
import battle from './reducers/BattleReducer';
import { player, enemy } from './reducers/CharacterReducer';

import { Game } from './Game';

const reducer = combineReducers({
    game
  , battle
  , player
  , enemy
})
const store = createStore(reducer, applyMiddleware(logger));


const main = () => {
  const game = new Game();
  game.start();
};


main();
