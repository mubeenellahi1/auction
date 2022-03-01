import { GET_ERROR, REMOVE_ERROR } from "./types/error";

export const getError = ({ msg, status }) => {
  return {
    type: GET_ERROR,
    payload: { msg, status },
  };
};

export const removeError = () => {
  return {
    type: REMOVE_ERROR,
  };
};