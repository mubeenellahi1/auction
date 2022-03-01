import {ProductCreate} from '../createProduct/create-product';
import React from "react";
import LayoutWrapper from "../../../components/utility/layoutWrapper";
import { FullColumn } from "../../../components/utility/rowColumn";
import Papersheet from "../../../components/utility/papersheet";

export default function EditProduct(props){

    const product_uuid = props.match.params.key; 

    return(
    <LayoutWrapper>
      <FullColumn>
        <Papersheet title="Edit product">
          <ProductCreate isEditPage={true} productUUID={product_uuid}/>
        </Papersheet>
      </FullColumn>
    </LayoutWrapper>
    )
}