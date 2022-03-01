import React from "react";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { CircularProgress } from "@material-ui/core";
import './displayProducts.css';

import Countdown from "./countdown";

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardMedia: {
    // height: 100,
    paddingTop: "56.25%", // 16:9
    paddingTop: "125%",
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

function getFirstLabelText(card) {
  return card.type === "auction" ? " For Auction" : " Limited";
}

function getSecondLabelText(card) {
  if (card.type === "auction") {
    //needs to be implemented through an API call?
    if (/*timeRemaining==0 */ new Date(card.open_time) > Date.now()) {
      return "Bidding not started";
    } else if (
      new Date(card.open_time) <= Date.now() &&
      new Date(card.close_time) > Date.now()
    ) {
      return "Ready to Bid!";
    } else if (new Date(card.close_time) < Date.now()) {
      return "Time's Up!";
    }
  } else {
    if (card.stock === 0) {
      return "Item out of stock ";
    } else {
      return "Items in Stock: " + card.stock;
    }
  }
}

function returnColoredLabel(color, card) {
  if (card.type === "auction" && new Date(card.close_time < Date.now())) {
    color = "red";
  }
  if (card.type === "limited" && card.stock <= 0) {
    color = "red";
  }
  return (
    <Box
      component="div"
      fontSize={11}
      style={{
        color: "white",
        backgroundColor: color,
        borderRadius: "25px",
        // width: "fit-content",
        padding: "3px 8px",
        margin: "3px 0",
        // maxHeight: "20px",
      }}
    >
      {getSecondLabelText(card)}
    </Box>
  );
}

export default function DisplayProducts(props) {
  const classes = useStyles();

  let cards = props.cardProps;
  const getFeaturedImage = (images) => {
    let imgArr = images.map((i) => {
      return i.is_featured === true ? i.image : false;
    });
    let featuredImage = "";

    for (let i of imgArr) {
      if (i !== false) {
        featuredImage = i;
        break;
      }
    }
    return featuredImage;
  };

  return cards.length === 0 ? (
    <Box
      display="flex"
      justifyContent="center"
      m={1}
      p={1}
      bgcolor="background.paper"
    >
      <CircularProgress />
    </Box>
  ) : (
      <React.Fragment>
        <main>
          <Container className={classes.cardGrid} maxWidth="lg">
            <Grid container justify="center" spacing={4}>
              {cards.map((card) => (
                <Grid
                  item
                  key={() => {
                    if (card.product_uuid) return card.product_uuid;
                    else return card.uuid;
                  }}
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  className="product_wrap_col"
                >
                  <Card className={'product_wrap_inner ' + classes.card}>
                    <CardMedia
                      image={
                        card && card.images ? getFeaturedImage(card.images) : ""
                      }
                      className={'product_inner_img '+ classes.cardMedia}
                      z-index="1"
                      style={{
                        position: "relative",
                      }}
                    >
                      <Grid
                        className="product_label_wrap"
                      // container
                      // spacing={0}
                      // style={{
                      //   justifyContent: "space-between",
                      // }}
                      >
                        <Box
                          className="product_limit_label"
                          component="div"
                          fontSize={11}
                          style={{
                            color: "white",
                            backgroundColor: "darkblue",
                            borderRadius: "25px",
                            width: "max-content",
                            padding: "3px 8px",
                            margin: "3px 0",
                          }}
                        >
                          {" "}
                          {getFirstLabelText(card && card)}
                        </Box>
                        {card && card.stock
                          ? card.stock > 0
                            ? /*|| time is NOT up*/
                            returnColoredLabel("green", card)
                            : returnColoredLabel("red", card)
                          : ""}
                      </Grid>
                      <div className="productCounterWrap">
                        <span className="counterTxt">
                          {new Date(card.open_time) > Date.now()
                            ? card.type === "auction"
                              ? "Bidding starts in "
                              // : "Product goes on sale in "
                              : "On sale in "
                            : card.type === "auction"
                              ? "Bidding ends in "
                              : "Product sale ends in "}
                            &#8691;
                      </span>
                        <Countdown
                          date={
                            new Date(card.open_time) > Date.now()
                              ? card.open_time
                              : card.close_time
                          }
                        />
                      </div>
                    </CardMedia>
                    <CardContent className={'product_title_wrap ' + classes.cardContent}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {" "}
                        <a className="productTitle"
                          onClick={() => {
                            if (card) {
                              if (card.key) props.handleProductClick(card.key);
                              else props.handleProductClick(card.uuid);
                            }
                          }}
                        >
                          <span>{card.title}</span>
                          <p className="titleViewBtn">
                            View Product
                          </p>
                        </a>
                      </Typography>

                      {card && card.type ? (
                        card.type === "auction" ? (
                          <span className="f14"> {"Starting Bid: " + card.price + " coins"}</span>
                        ) : (
                            ""
                          )
                      ) : (
                          ""
                        )}

                      {card && card.type ? (
                        card.type === "auction" ? (
                          <div>
                            <span className="f14">
                              {"\nHighest Bid: " +
                                card.get_highest_bid +
                                " coins\n"}{" "}
                            </span>
                          </div>
                        ) : (
                            <span className="f14">
                              {"\nPrice: " + card.price + " coins\n  "}
                              <br />
                            </span>
                          )
                      ) : (
                          ""
                        )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </main>
      </React.Fragment>
    );
}
