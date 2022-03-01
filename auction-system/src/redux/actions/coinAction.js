import { ADD_COINS } from './types/coins';
import { SUBTRACT_COINS } from './types/coins';

export const addCoinsAction = (numberOfCoins) => {
  return {
    type: ADD_COINS,
    payload: {coins:numberOfCoins },
  };
};

export const subtractCoinsAction = (numberOfCoins) => {
  return {
    type: SUBTRACT_COINS,
    payload: {coins:numberOfCoins },
  };
};