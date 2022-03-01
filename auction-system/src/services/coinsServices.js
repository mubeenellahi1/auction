import { API_URL } from './config';
import axios from 'axios';


export async function buyCoinsService(numberOfCoins){
    const apiEndpoint = API_URL + "/users/add-coins/"
    const config = {
        headers: {
          "content-type": "application/json",
          "Authorization": "Token "+localStorage.token,
        }
    }
    const coinsObj ={coins:numberOfCoins}
    const resp = await axios.post(apiEndpoint,coinsObj,config)
    .then((response) =>{
        return response;
    })
    .catch((error) => {
        return error;
    });

    //console.log(resp);
    return resp;
}