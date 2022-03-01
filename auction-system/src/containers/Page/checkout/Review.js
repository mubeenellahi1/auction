import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Grid from "@material-ui/core/Grid";
import { store } from "../../../redux/store";
import { addressDetails } from "./checkout";
import { checkoutService } from "./../../../services/checkoutService";
//let products = store.getState().cart;

const payments = [
  { name: "Card type", detail: "Visa" },
  { name: "Card holder", detail: "Mr John Smith" },
  { name: "Card number", detail: "xxxx-xxxx-xxxx-1234" },
  { name: "Expiry date", detail: "04/2024" },
];

const useStyles = makeStyles((theme) => ({
  listItem: {
    padding: theme.spacing(1, 0),
  },
  total: {
    fontWeight: 700,
  },
  title: {
    marginTop: theme.spacing(2),
  },
}));

export default function Review() {
  const classes = useStyles();
  var totalCost = 0;
  const [products, setProducts] = React.useState(store.getState().cart);
  // if (products.length === 0) {
  //   products.push({
  //     price: 100,
  //     product_name: "tesing9000",
  //     quantity_ordered: 1,
  //     quantity_in_stock: 69,
  //     uuid: "626ed2a9-009f-495d-a6be-f1c98a24a8f4",
  //   });
  //   products.push({
  //     price: 120,
  //     product_name: "tesing9100",
  //     quantity_ordered: 6,
  //     quantity_in_stock: 420,
  //     uuid: "69696ed2a9-009f-495d-a6be-f1c98a24a8f4",
  //   });
  // }
  for (let i = 0; i < products.length; ++i) {
    totalCost += products[i].price * products[i].quantity_ordered;
  }

  React.useEffect(()=>{
    setProducts(store.getState().cart);
  },[])

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Order summary
      </Typography>
      <List disablePadding>
        {products.map((product) => (
          <ListItem className={classes.listItem} key={product.name}>
            <ListItemText primary={product.product_name} />
            <Typography variant="body2">
              ${product.price + " (x" + product.quantity_ordered + ")"}
            </Typography>
          </ListItem>
        ))}
        <ListItem className={classes.listItem}>
          <ListItemText primary="Total" />
          <Typography variant="subtitle1" className={classes.total}>
            ${totalCost}
          </Typography>
        </ListItem>
      </List>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" gutterBottom className={classes.title}>
            Shipping
          </Typography>
          <Typography gutterBottom>
            {addressDetails.firstName + " " + addressDetails.lastName}
          </Typography>
          <Typography gutterBottom>
            {addressDetails.address1 + "\n" + addressDetails.address2}
          </Typography>
        </Grid>
        <Grid item container direction="column" xs={12} sm={6}>
          <Typography variant="h6" gutterBottom className={classes.title}>
            Payment details
          </Typography>
          <Grid container>
            {payments.map((payment) => (
              <React.Fragment key={payment.name}>
                <Grid item xs={6}>
                  <Typography gutterBottom>{payment.name}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography gutterBottom>{payment.detail}</Typography>
                </Grid>
              </React.Fragment>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
