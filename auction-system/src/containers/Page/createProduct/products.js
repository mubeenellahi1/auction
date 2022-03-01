import React, { Component } from 'react';
import Fab from '@material-ui/core/Fab';
import {
  GridListViewWrapper,
  Rate,
} from '../../../components/algolia/algoliaComponent.style';
import Countdown from '../products/countdown'

class Hit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addCartLoading: false,
    };
  }
  render() {
    const currentDate = new Date();
    const year = (currentDate.getMonth() === 11 && currentDate.getDate() > 23) ? currentDate.getFullYear() + 1 : currentDate.getFullYear();
  
    const { hit } = this.props;
    // const className =
    //   this.props.view === 'gridView'
    //     ? 'algoliaGrid GridView'
    //     : 'algoliaGrid ListView';
    // let addedTocart = false;
    // this.props.productQuantity.forEach(product => {
    //   if (product.objectID === hit.objectID) {
    //     addedTocart = true;
    //   }
    // });
    return (
      <GridListViewWrapper >
        <div className="alGridImage">
          <img alt="#" src={hit.image} />
          {/* {!addedTocart ? ( */}
         {/* <Button */}
        {/* //       onClick={() => {
                this.setState({ addCartLoading: true });
                const update = () => {
                  this.props.addToCart(hit);
                  this.setState({ addCartLoading: false });
                };
                setTimeout(update, 1500);
              }}
            >
              <CartIcon>shopping_cart</CartIcon>
              Add to cart
            </Button>
          ) : (
            <Button
              onClick={() => this.props.changeViewTopbarCart(true)}
              type="button"
            >
              View Cart
            </Button>
          )}*/}
        </div> 
        <div className="alGridContents">
        <div class="alGridName">
            <span class="ais-Highlight">
            <span class="ais-Highlight-nonHighlighted">Amazon - Fire TV Stick</span>
            </span>
        </div>

          <div className="alGridPriceRating">
            <span className="alGridPrice">${hit.price}</span>

            <div className="alGridRating">
              <Rate
                disabled
                starCount={6}
                value={hit.rating}
                name="algoliaRating"
              />
        <Countdown date={`${year}-12-24T00:00:00`} />
        <Fab variant="extended">
            checking badge
        </Fab>

            </div>
     
          </div>

          <div className="alGridDescription">
            {/* <Snippet attribute="description" hit={hit} /> */}
          </div>
        </div>
      </GridListViewWrapper>
    );
  }
}
function mapStateToProps(state) {
  const { productQuantity } = state.Ecommerce;
  return {
    productQuantity,
  };
}
export default(Hit);
