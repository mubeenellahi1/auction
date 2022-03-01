import {
  ADD_TO_CART_SUCCESS,
  CLEAR_CART,
  REMOVE_FROM_CART_SUCCESS,
} from "./../actions/types/cart";

const initialState = [];

export default function cart(state = initialState, action) {
  if (action.type === ADD_TO_CART_SUCCESS) {
    if (state.length !== 0) {
      const newState = [...state];

      for (let i = 0; i < state.length; i++) {
        if (action.payload.uuid === state[i].uuid) {
          if (action.payload.from_cart === true) {
            newState[i].quantity_ordered = action.payload.quantity_ordered;
          } else {
            newState[i].quantity_ordered =
              newState[i].quantity_ordered + action.payload.quantity_ordered;
          }
          return newState;
        }
      }
    }

    return [
      ...state,
      {
        uuid: action.payload.uuid,
        product_name: action.payload.product_name,
        quantity_ordered: action.payload.quantity_ordered,
        price: action.payload.price,
        quantity_in_stock: action.payload.quantity_in_stock,
      },
    ];
  } else if (action.type === REMOVE_FROM_CART_SUCCESS) {
    let newState;
    newState = state.filter((product) => {
      if (product.uuid !== action.payload.product_removed_uuid) return product;
      return null;
    });
    return newState;
  } else if (action.type === CLEAR_CART) {
    let newState = [];
    return newState;
  } else {
    return state;
  }
}
