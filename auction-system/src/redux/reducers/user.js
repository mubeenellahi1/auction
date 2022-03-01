
import { ADD_COINS, SUBTRACT_COINS } from '../actions/types/coins';
import {
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    BECOME_SELLER_SUCCESS
} from "../actions/types/auth";

const initialState = {
    token: null,
    uuid: null,
    email: null,
    phone_number: null,
    username: null,
    name: null,
    birthday: null,
    gender: null,
};

export default function user(state = initialState, action) {
    if (action.type === LOGIN_SUCCESS) {
        return {
            ...state,
            uuid: action.payload.uuid,
            token: action.payload.token,
            email: action.payload.email,
            phone_number: action.payload.phone_number,
            username: action.payload.username,
            name: action.payload.name,
            birthday: action.payload.birthday,
            gender: action.payload.gender,
            is_seller:action.payload.is_seller,
            coins: action.payload.coins,
            name:action.payload.name,
        };
    } else if (action.type === LOGIN_FAIL) {
    } else if (action.type === LOGOUT_SUCCESS) {
        return {
            ...state,
            token: null,
            uuid: null,
            email: null,
            phone_number: null,
            username: null,
            name: null,
            birthday: null,
            gender: null,
            is_seller:null,
            coins:null,
            name:null,
        };
    }
    else if(action.type===BECOME_SELLER_SUCCESS){
        return{
            ...state,
            is_seller:action.payload.is_seller,
        }
    }
    else if(action.type===ADD_COINS){
        let newCoins = state.coins + action.payload.coins;
        return{
            ...state,
            coins:newCoins,
        }
    }

    else if(action.type===SUBTRACT_COINS){
        let newCoins = state.coins - action.payload.coins;
        return{
            ...state,
            coins:newCoins,
        }
    } 
    return state;
}
