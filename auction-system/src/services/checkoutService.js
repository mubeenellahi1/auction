import { API_URL } from './config';
import axios from 'axios';

export async function checkout(products ){
    const apiEndpoint = API_URL + "/product/products-order/"
    const config = {
        headers: {
          "content-type": "application/json",
          "Authorization": "Token "+localStorage.token,
        }
    }
    const checkoutObjList ={products}
    const resp = await axios.post(apiEndpoint,checkoutObjList,config)
    .then((response) =>{
        return response;
    })
    .catch((error) => {
        return error;
    });

    //console.log(resp);
    return resp;
}