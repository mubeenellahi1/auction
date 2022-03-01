import {
  ADD_TO_CART_SUCCESS,
  CLEAR_CART,
  REMOVE_FROM_CART_SUCCESS,
  UPDATE_CART_SUCCESS,
} from "./types/cart";

export function addToCartAction(productObj) {
  //console.log("object sent to cart:", productObj);
  const returnObject = {
    type: ADD_TO_CART_SUCCESS,
    payload: {
      uuid: productObj.uuid,
      product_name: productObj.name,
      quantity_ordered: parseInt(productObj.quantity_ordered),
      price: productObj.price,
      quantity_in_stock: productObj.quantity_in_stock,
      from_cart: false,
    },
  };
  if (productObj.fromCart === true) {
    returnObject.payload.from_cart = true;
  }
  return returnObject;
}

export function removeFromCartAction(productRemovedUUID) {
  return {
    type: REMOVE_FROM_CART_SUCCESS,
    payload: {
      product_removed_uuid: productRemovedUUID,
    },
  };
}

export function updateCartAction(prodList) {
  return {
    type: UPDATE_CART_SUCCESS,
    payload: {
      products_list: prodList,
    },
  };
}

export function clearCartAction() {
  return {
    type: CLEAR_CART,
    payload: {},
  };
}
