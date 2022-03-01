
const initialState = {
  msg: {},
  status: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case "GET_ERROR":
      return {
        msg: action.payload.msg,
        status: action.payload.status,
      };
    case "REMOVE_ERROR":
      return {
        msg: {},
        status: null,
      };
    default:
      return state;
  }
}