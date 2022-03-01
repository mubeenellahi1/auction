import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import "./sellerPopupModal.css";
import csc from "country-state-city";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import {becomeSellerService} from './../../../services/sellerServices';
import {store} from '../../../redux/store';
import { becomeSellerAction } from '../../../redux/actions/userAction';


export default function SellerPopupModal() {
    
    const [open, setOpen] = React.useState(false);


    const [city, setCity] = React.useState("");
    const [addressState, setAddressState] = React.useState("");
    const [countryCode, setCountryCode] = React.useState("KR");
    const [listOfCities, setListOfCities] = React.useState([]);
    const listOfStates = csc.getStatesOfCountry("KR");


    const [alertOpen, setAlertOpen]=React.useState(false);
    const [alertMessage, setAlertMessage]=React.useState("");
    const [alertSeverity, setAlertSeverity] = React.useState("");


    const [bank, setBank] = React.useState("");
    const [phoneNumber, setPhoneNumber] = React.useState("");
    const [bankAccountNumber, setBankAccountNumber] = React.useState("");
    const [homeAddress, setHomeAddress] = React.useState("");
    const [bankAccountTitle, setBankAccountTitle] = React.useState("");


   

    const listOfBanks = [
        "Bank of Korea",
        "Korea Development Bank",
        "Industrial Bank of Korea",
        "Korea Eximbank",
        "National Federation of Fisheries Cooperatives",
        "Nonghyup Bank",
        "Citibank Korea",
        "KEB Hana Bank",
        "KB Kookmin Bank",
        "Standard Chartered Korea",
        "Shinhan Bank",
        "Woori Bank",
        "Daegu Bank",
        "Busan Bank",
        "Kyongnam Bank",
        "Kwangju Bank",
        "Jeonbuk Bank",
        "Jeju Bank",
        "K Bank",
        "Kakao Bank",
    ];

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleBankChange = (event) => {
        setBank(event.target.value);
    };

    const handleCountryChange = (event) => {
        setCountryCode(event.target.value);
    };

    const handleAddressStateChange = (event) => {
        setAddressState(event.target.value);
        const tempArr = csc.getCitiesOfState(countryCode, event.target.value);
        setListOfCities(tempArr);
    };

    const handleCityChange = (event) => {
        setCity(event.target.value);
    };

    const handleAlertClose = (event) => {
        setAlertOpen(false);
    }

    const handlePhoneNumberChange = (event) =>{
        setPhoneNumber(event.target.value);
    }

    const handleBankAccountNumberChange = (event) =>{
        setBankAccountNumber(event.target.value);
    }

    const handleBankAccountTitleChange = (event) =>{
        setBankAccountTitle(event.target.value);
    }

    const handleHomeAddressChange = (event) =>{
        setHomeAddress(event.target.value);
    }



    const handleSubmit = async (event) => {
        if(!phoneNumber || !homeAddress || !city || !bank || !bankAccountNumber || !bankAccountTitle){
            setAlertMessage("Incomplete information provided");
            setAlertOpen(true);
            setAlertSeverity("error");
            return;
        }


        const sellerObj={
            phone_number: phoneNumber,
            home_address: homeAddress,
            city: city,
            bank_name: bank,
            account_title: bankAccountTitle,
            account_number: bankAccountNumber
        }
        const response = await becomeSellerService(sellerObj);
        if(response.data.status==='failure')
        {   
            setAlertMessage("A email has been sent to your email address. Kindly verify it and submit the form again!");
            setAlertOpen(true);
            setAlertSeverity("error");
            return;
        }
        else if(response.data.status==='success'){
            store.dispatch(becomeSellerAction());
            setAlertMessage("You've successfully registered as a seller!");
            setAlertOpen(true);
            setAlertSeverity("success");
            setTimeout(() => {  window.location.reload(); }, 2000);
            return;
        }
        else
        {
            setAlertMessage("An unknown error occurred");
            setAlertOpen(true);
            setAlertSeverity("error");
            return;

        }
    }

    return (
        <div>
                <Button
                    variant="contained"
                    className="topbarSellerButton"
                    onClick={handleClickOpen}
                >
                    Become a Seller
                </Button>
    
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">
                    Become a Seller
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To successfuly signup as a seller, kindly fill and
                        submit the following details.
                    </DialogContentText>
                    <br />

                    <InputLabel htmlFor="bankNameLabel" fullWidth>
                        Bank Name
                    </InputLabel>
                    <Select
                        fullWidth
                        native
                        required
                        input={<Input id="bankNameLabel" />}
                        value={bank}
                        onChange={handleBankChange}
                    >
                        <option aria-label="None" value="" />
                        {listOfBanks.map((bankName) => {
                            return <option key={bankName} value={bankName}>{bankName}</option>;
                        })}
                    </Select>
                    <TextField
                        required
                        margin="dense"
                        id="accountTitle"
                        label="Bank Account Title"
                        type="text"
                        fullWidth
                        onChange={handleBankAccountTitleChange}
                    />

                    <TextField
                        required
                        margin="dense"
                        id="accountNumber"
                        label="Bank Account Number"
                        type="text"
                        fullWidth
                        onChange={handleBankAccountNumberChange}
                    />
                    <TextField
                        required
                        margin="dense"
                        id="phoneNumber"
                        label="Phone Number"
                        type="text"
                        fullWidth
                        onChange={handlePhoneNumberChange}
                    />
                    <br/>
                    <br/>
                    <InputLabel htmlFor="countryDropdownLabel">
                        Country
                    </InputLabel>
                    <Select
                        required
                        fullWidth
                        input={<Input id="countryDropdownLabel" />}
                        value={countryCode}
                        onChange={handleCountryChange}
                        displayEmpty
                        renderValue={()=>{return "South Korea"}}
                    >
                        <MenuItem value="KR">South Korea</MenuItem>
                        
                    </Select>
                    <br/>
                    <br/>
                    <InputLabel htmlFor="stateDropdownLabel">State</InputLabel>
                    <Select
                        required
                        fullWidth
                        input={<Input id="stateDropdownLabel" />}
                        value={addressState}
                        onChange={handleAddressStateChange}
                    >
                        {listOfStates.map((stateObj) => {
                            return (
                                <MenuItem key={stateObj.isoCode} value={stateObj.isoCode}>
                                    {stateObj.name}
                                </MenuItem>
                            );
                        })}
                    </Select>
                    <br/>
                    <br/>
                    <InputLabel htmlFor="cityDropdownLabel">City</InputLabel>
                    <Select
                        required
                        fullWidth
                        input={<Input id="cityDropdownLabel" />}
                        value={city}
                        onChange={handleCityChange}
                    >
                        {listOfCities.map((cityObj) => {
                            return (
                                <MenuItem key={cityObj.name} value={cityObj.name}>
                                    {cityObj.name}
                                </MenuItem>
                            );
                        })}
                    </Select>
                    <TextField
                        required
                        margin="dense"
                        id="address"
                        label="Home Address"
                        type="text"
                        fullWidth
                        onChange={handleHomeAddressChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button type="submit" onClick={handleSubmit} color="primary">
                        Submit
                    </Button>
                </DialogActions>
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
            </Dialog>
        </div>
    );
}
