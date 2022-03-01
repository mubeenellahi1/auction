
import { LOGIN_SUCCESS,LOGOUT_SUCCESS, BECOME_SELLER_SUCCESS } from './types/auth';


export function loginUserAction(userObj){
    return{
        type: LOGIN_SUCCESS,
        payload:{
            uuid:userObj.uuid,
            token:userObj.token,
            email: userObj.email,
            phone_number: userObj.phone_number,
            username: userObj.username,
            name: userObj.name,
            birthday: userObj.birthday,
            gender: userObj.gender,
            is_seller:userObj.is_seller,
            coins: userObj.coins,
            name: userObj.name
        }
    }
}

export function logoutUserAction(){
    return{
        type:LOGOUT_SUCCESS,
        payload:{}
    }
}

export function becomeSellerAction(){
    return{
        type:BECOME_SELLER_SUCCESS,
        payload:{is_seller:true}
    }
}