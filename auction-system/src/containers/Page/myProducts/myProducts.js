import React from "react";
import Papersheet from "../../../components/utility/papersheet";
import LayoutWrapper from "../../../components/utility/layoutWrapper";
import { FullColumn } from "../../../components/utility/rowColumn";
import DisplayProducts from "../listOfProducts/displayProducts";
import { getProductsBySeller } from "../../../services/productsServices";
import { Pagination } from "@material-ui/lab";
import { CircularProgress } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import { Alert, AlertTitle } from "@material-ui/lab";
import { Button } from "@material-ui/core";
import { API_URL } from "../../../services/config";

class MyProducts extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      list: [],
      currentPage: 1,
      responseStatus: false,
      totalPages: 0,
    };
  }

  async setList(pageNum) {
    const response = await getProductsBySeller(pageNum);
    if (response.data.status === "success") {
      let tempList = response.data.data.products;

      for (let product of tempList) {
        product.images &&
          product.images.forEach((i) => {
            i.image = API_URL + i.image;
          });
      }

      this.setState({
        responseStatus: true,
        list: tempList,
        totalPages: response.data.data.pages,
        currentPage: pageNum,
      });
    }
  }

  async componentDidMount() {
    await this.setList(1);
  }

  handleProductClick(key) {
    let history = this.props.history;
    history.push("product-detail/" + key + "/true");
  }
  render() {
    return (
      <LayoutWrapper>
        <FullColumn>
          <Papersheet title={"My Products"}>
            <Box display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  let history = this.props.history;
                  history.push("/dashboard/seller/create-product");
                }}
              >
                Create New Product
              </Button>
            </Box>
            {this.state.list.length === 0 ? (
              <Box display="flex" justifyContent="center">
                <CircularProgress></CircularProgress>
              </Box>
            ) : this.state.responseStatus === true ? (
              <div className="row">
                <DisplayProducts
                  cardProps={this.state.list}
                  handleProductClick={this.handleProductClick.bind(this)}
                />
              </div>
            ) : (
              <Alert severity="error">
                <AlertTitle>Error</AlertTitle>
                Oops! Somebody messed up! —{" "}
                <strong>Please try again later!</strong>
              </Alert>
            )}
            <Pagination
              count={this.state.totalPages}
              variant="outlined"
              color="primary"
              onChange={async (event, value) => {
                this.setState({
                  list: [],
                });
                await this.setList(value);
              }}
            />
          </Papersheet>
        </FullColumn>
      </LayoutWrapper>
    );
  }
}

export default MyProducts;
