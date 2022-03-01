import { API_URL } from "./config";
import axios from "axios";

export async function placeBidService(productUUID, numberOfCoins) {
    const apiEndpoint = API_URL + "/product/create-bids/";
    const config = {
        headers: {
            "content-type": "application/json",
            Authorization: "Token " + localStorage.token,
        },
    };
    const bidObj = { product_uuid: productUUID, price: numberOfCoins };
    const resp = await axios
        .post(apiEndpoint, bidObj, config)
        .then((response) => {
            return response;
        })
        .catch((error) => {
            error.status = error.response.status;
            return error;
        });

    //console.log(resp);
    return resp;
}
