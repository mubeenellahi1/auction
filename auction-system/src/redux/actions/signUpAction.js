import axios from "axios";
import { getError } from "./errorAction";
import{API_URL} from "../../config"
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
} from "./types/auth";
export const signUp = ({
    name,
    email,
    password,
    confirm_password,
    username,
    birthday,
    phone_number,
    gender
  }) => (dispatch) => {
    const config = {
      headers: {
        "content-type": "application/json",
      },
    };
    const body = JSON.stringify({ name, email, password, confirm_password,username,birthday,phone_number,gender});
    axios
      .post(API_URL.concat("/users/signup/"), body, config)
      .then((response) =>{
          if(response.status === 201)
                dispatch({ type: REGISTER_SUCCESS, payload: response.data });
          if(response.status===200)
          {
            dispatch(getError(response.data, response.status));
          }
      })
      .catch((error) => {
        dispatch(getError(error.response.data, error.response.status));
        dispatch({ type: REGISTER_FAIL });
      });
  };