import React from "react";
import LayoutWrapper from "../../../components/utility/layoutWrapper";
import Papersheet from "../../../components/utility/papersheet";
import { FullColumn } from "../../../components/utility/rowColumn";
import DisplayProducts from "./displayProducts.js";
import { Pagination } from "@material-ui/lab";
// eslint-disable-next-line
import FirebaseHelper from "../../../helpers/firebase/index";
import firebase from "firebase";
import "./listOfProducts.css";
import { API_URL } from "../../../services/config";

class ListOfProducts extends React.Component {
  constructor(props, context) {
    super(props);

    this.state = {
      list: [],
      pageList: [],
      currentPage: 1,
      productFirebaseKey: "",
    };
    this.productsPerPage = props.productsPerPage ? props.productsPerPage : 15; //set custom default value=10 if not given in props
    // firebase.initializeApp({ firebaseConfig });
  }

  componentDidMount() {
    var tempList = [];
    const listRef = firebase.database().ref("products");
    listRef.on("value", (snapshot) => {
      const prods = snapshot.val();
      tempList = [];
      for (let key in prods) {
        let obj = prods[key];
        obj.key = key;
        obj.images &&
          obj.images.forEach((i) => {
            i.image = API_URL + "/" + i.image;
          });
        tempList.push(obj);
      }

      this.setState({
        pageList: tempList.slice(
          (this.state.currentPage - 1) * this.productsPerPage,
          this.productsPerPage * (1 + (this.state.currentPage - 1))
        ),
      });
      this.setState({
        list: tempList,
      });
    });
  }

  handleProductClick(key) {
    let history = this.props.history;
    history.push("product-detail/" + key);
  }

  render() {
    return (
      <LayoutWrapper>
        <FullColumn>
          <Papersheet title={"List of Products"}>
            <div className="row">
              <DisplayProducts
                cardProps={this.state.pageList}
                handleProductClick={this.handleProductClick.bind(this)}
              />

              <Pagination
                count={Math.ceil(this.state.list.length / this.productsPerPage)}
                variant="outlined"
                color="primary"
                onChange={async (event, value) => {
                  this.setState({
                    pageList: [],
                  });

                  this.setState({
                    pageList: this.state.list.slice(
                      (value - 1) * this.productsPerPage,
                      this.productsPerPage * (1 + (value - 1))
                    ),
                  });
                  this.setState({
                    currentPage: value,
                  });
                }}
              />
            </div>
          </Papersheet>
        </FullColumn>
      </LayoutWrapper>
    );
  }
}

export default ListOfProducts;
