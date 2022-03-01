import { API_URL } from "./config";
import axios from "axios";

export async function getListOfProducts(pageNum) {
  const apiEndpoint = API_URL + "/product/list-products/?page=" + pageNum;
  const config = {
    headers: {
      "content-type": "application/json",
      Authorization: "Token " + localStorage.token,
    },
  };
  const resp = await axios
    .get(apiEndpoint, config)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });

  return resp;
}

export async function createProductService(body) {
  const apiEndpoint = API_URL + "/product/create-product/";
  const config = {
    headers: {
      "content-type": "application/json",
      Authorization: "Token " + localStorage.token,
    },
  };

  const resp = await axios
    .post(apiEndpoint, body, config)
    .then((response) => {
      console.log("RESPONSE STATUS: ",response.status);
      return response;
    })
    .catch((error) => {
      error.status=error.response.status;
      console.log("ERROR STATUS: ", error.status);
      return error;
    });
  return resp;
}

export async function updateProductService(body) {
  const apiEndpoint = API_URL + "/product/update-product/";
  const config = {
    headers: {
      "content-type": "application/json",
      Authorization: "Token " + localStorage.token,
    },
  };

  const resp = await axios
    .post(apiEndpoint, body, config)
    .then((response) => {
      console.log("RESPONSE STATUS: ",response.status);
      return response;
    })
    .catch((error) => {
      error.status=error.response.status;
      console.log("ERROR STATUS: ", error.status);
      return error;
    });
  return resp;
}

export async function getProductsBySeller(pageNum){
  const apiEndpoint = API_URL + "/product/my-products?page=" + pageNum;
  const config = {
    headers: {
      "content-type": "application/json",
      Authorization: "Token " + localStorage.token,
    },
  };
  const resp = await axios
    .get(apiEndpoint, config)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });

  //console.log(resp);
  return resp;
}

export async function getProductDetails(uuid){
  const apiEndpoint = API_URL + "/product/retrieve-product/?product_uuid=" + uuid;
  const config = {
    headers: {
      "content-type": "application/json",
      Authorization: "Token " + localStorage.token,
    },
  };
  const resp = await axios
    .get(apiEndpoint, config)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });

  //console.log(resp);
  return resp;
}

export async function deleteProduct(uuid){
  const apiEndpoint = API_URL + "/product/remove-product/";
  const headerObj= {
    "content-type": "application/json",
    Authorization: "Token " + localStorage.token,
  };
  const resp = await axios
    .delete(apiEndpoint,{data:{product_uuid:uuid},headers:headerObj})
    .then((response) => {
      //console.log("RESPONSE STATUS: ", response.status);
      return response;
    })
    .catch((error) => {
      error.status=error.response.status;
      //console.log("ERROR STATUS: ",error.status);
      return error;
    });

  //console.log(resp);
  return resp;
}