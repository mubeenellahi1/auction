import { API_URL } from './config';
import axios from 'axios';


export async function becomeSellerService(sellerObj){
    const apiEndpoint = API_URL + "/users/become-seller/"
    const config = {
        headers: {
          "content-type": "application/json",
          "Authorization": "Token "+localStorage.token,
        }
    }
    const obj=sellerObj;
    const resp = await axios.post(apiEndpoint,obj,config)
    .then((response) =>{
        return response;
    })
    .catch((error) => {
        return error;
    });

    //console.log(resp);
    return resp;
}