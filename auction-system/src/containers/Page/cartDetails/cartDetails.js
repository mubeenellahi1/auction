import React from "react";
import LayoutWrapper from "../../../components/utility/layoutWrapper";
import Papersheet from "../../../components/utility/papersheet";
import { FullColumn } from "../../../components/utility/rowColumn";
import Orders from "./cartList";

class CartDetails extends React.Component {

  render() {
    return (
      <LayoutWrapper>
        <FullColumn>
          <Papersheet title="Cart">
            <Orders />
          </Papersheet>
        </FullColumn>
      </LayoutWrapper>
    );
  }
}

export default CartDetails;
