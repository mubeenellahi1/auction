import React, { Component } from "react";
import LayoutWrapper from "../../../components/utility/layoutWrapper";
import Papersheet from "../../../components/utility/papersheet";
import { FullColumn } from "../../../components/utility/rowColumn";
import firebase from "firebase";
// eslint-disable-next-line
import FirebaseHelper from "../../../helpers/firebase/index";
import ShowDetails from "./showDetails.js";
import { getProductDetails } from "../../../services/productsServices";
import "./productDetail.css";
import { API_URL } from "../../../services/config";

export default class ProductDetail extends Component {
  constructor(props, context) {
    super();
    this.state = {
      product: {},
      is_seller: false,
    };

    this.state.product = null;
  }

  async componentDidMount() {
    if (this.props.match.params.is_seller) {
      this.setState({ is_seller: true });
      const response = await getProductDetails(this.props.match.params.key);
      if (response.data.status === "success") {
        let tempProduct = response.data.data;
        tempProduct.images &&
          tempProduct.images.forEach((i) => {
            i.image = API_URL + i.image;
          });
        this.setState({ product: tempProduct });
      } else {
        alert("Unexpected Error");
      }
    } else {
      this.setState({ is_seller: false });
      const listRef = firebase
        .database()
        .ref("products/" + this.props.match.params.key);
      listRef.on("value", (snapshot) => {
        let tempProduct = snapshot.val();
        tempProduct.images &&
          tempProduct.images.forEach((i) => {
            i.image = API_URL + "/" + i.image;
          });
        this.setState({ product: tempProduct });
      });
    }
  }

  render() {
    return (
      <LayoutWrapper>
        <FullColumn>
          <Papersheet>
            <ShowDetails
              productProps={this.state.product}
              isSeller={this.state.is_seller}
            />
          </Papersheet>
        </FullColumn>
      </LayoutWrapper>
    );
  }
}
