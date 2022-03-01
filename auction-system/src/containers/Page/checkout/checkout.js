import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Paper from "@material-ui/core/Paper";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import AddressForm from "./AddressForm";
import PaymentForm from "./PaymentForm";
import Review from "./Review";
import { checkout} from "./../../../services/checkoutService";
import { store } from "../../../redux/store";
import { clearCartAction } from "../../../redux/actions/cartAction";
import { subtractCoinsAction } from '../../../redux/actions/coinAction';
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  layout: {
    width: "auto",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));

const steps = ["Shipping address", "Payment details", "Review your order"];

function getStepContent(step) {
  switch (step) {
    case 0:
      return <AddressForm />;
    case 1:
      return <PaymentForm />;
    case 2:
      return <Review />;
    default:
      throw new Error("Unknown step");
  }
}



export let addressDetails = {
  firstName: "",
  lastName: "",
  address1: "",
  address2: "",
  city: "",
  stateProvinceRegion: "",
  zipPostalCode: "",
  country: "",
  checkBox: false,
};

export let paymentDetails = {
  nameOnCard: "",
  cardNumber: "",
  expiryDate: null,
  securityCode: "",
  checkBox: false,
};

export default function Checkout() {
  const classes = useStyles();
  var checkoutObjList =[];
  var total = 0;
  const [activeStep, setActiveStep] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState("");
  const [alertSeverity, setAlertSeverity] = React.useState("");
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [numberOfCoins, setNumberOfCoins] = React.useState(0);
  const [currentAvailableCoins, setCurrentAvailableCoins] = React.useState(
    store.getState().user.coins
  );
  
  React.useEffect(() => {
    setCurrentAvailableCoins(store.getState().user.coins);
  }, []);

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const handleNext = async () => {
    if (activeStep === 0) {
      addressDetails.firstName = document.getElementById("firstName").value;
      addressDetails.lastName = document.getElementById("lastName").value;
      addressDetails.address1 = document.getElementById("address1").value;
      addressDetails.address2 = document.getElementById("address2").value;
      addressDetails.city = document.getElementById("city").value;
      addressDetails.stateProvinceRegion = document.getElementById(
        "state"
      ).value;
      addressDetails.zipPostalCode = document.getElementById("zip").value;
      addressDetails.country = document.getElementById("country").value;
      addressDetails.checkbox = document.getElementsByClassName(
        "saveAddress"
      ).value;
    }
    if(activeStep == 2){
      const products = store.getState().cart;
      for (let i = 0; i < products.length; ++i) {
        checkoutObjList.push( { uuid: products[i].uuid , quantity: products[i].quantity_ordered});
        total += products[i].price
      }
      let response = await checkout(checkoutObjList);
        if (response.data.status === "failure") {
          setAlertMessage(response.data.message);
          setAlertOpen(true);
          setAlertSeverity("error");
          return;
        } else if (response.data.status === "success") {
          store.dispatch(clearCartAction());
          store.dispatch(subtractCoinsAction(parseFloat(total)));
          var a = store.getState().user.coins
          setAlertMessage("Checkout successful!");
          setAlertOpen(true);
          setAlertSeverity("success");

          setOpen(false);
          return;
        } 
    
    }
    setActiveStep(activeStep + 1);
    
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="absolute" color="default" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            Company name
          </Typography>
        </Toolbar>
      </AppBar>
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h4" align="center">
            Checkout
          </Typography>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <React.Fragment>
            {activeStep === steps.length ? (
              <React.Fragment>
                <Typography variant="h5" gutterBottom>
                  Thank you for your order.
                </Typography>
                <Typography variant="subtitle1">
                  Your order number is #2001539. We have emailed your order
                  confirmation, and will send you an update when your order has
                  shipped.
                </Typography>
              </React.Fragment>
            ) : (
              <React.Fragment>
                {getStepContent(activeStep)}
                <div className={classes.buttons}>
                  {activeStep !== 0 && (
                    <Button onClick={handleBack} className={classes.button}>
                      Back
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    className={classes.button}
                  >
                    {activeStep === steps.length - 1 ? "Place order" : "Next"}
                  </Button>
                </div>
              </React.Fragment>
            )}
          </React.Fragment>
          <Snackbar
              open={alertOpen}
              autoHideDuration={6000}
              onClose={handleAlertClose}
            >
              <Alert
                elevation={6}
                variant="filled"
                onClose={handleAlertClose}
                severity={alertSeverity}
              >
                {alertMessage}
              </Alert>
            </Snackbar>
        </Paper>
      </main>
    </React.Fragment>
  );
}
