import React, { Component } from "react";
import { Link } from "react-router-dom";
import signinImg from "../../../images/signin.svg";
import TextField from "../../../components/uielements/textfield";
import Scrollbars from "../../../components/utility/customScrollBar";
import Button from "../../../components/uielements/button";
import SignUpStyleWrapper from "./signup.style";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { signupUserService } from "../../../services/userServices";

class SignUp extends Component {
  handleSignUp = async () => {
    const user = {
      username: this.state.username,
      password: this.state.password,
      confirm_password: this.state.confirm_password,
      name: this.state.name,
      phone_number: this.state.phone_number,
      email: this.state.email,
      gender: this.state.gender,
      birthday: this.state.birthday,
      is_seller: false,
    };

    if (
      this.state.username === "" ||
      this.state.password === "" ||
      this.state.confirm_password === "" ||
      this.state.name === "" ||
      this.state.phone_number === "" ||
      this.state.email === "" ||
      this.state.gender === "" ||
      this.state.birthday === ""
    ) {
      this.setState({
        open: true,
        class: "error",
        message: "Please fill all fields",
      });

      return;
    } else if (this.state.password !== this.state.confirm_password) {
      this.setState({
        open: true,
        class: "error",
        message: "Both password fields should be identical",
      });
      return;
    } else if (this.state.phone_number.length > 15 || this.state.phone_number[0] != "+" || isNaN(this.state.phone_number.substring(1) == true)) {
      console.log("phone: " + this.state.phone_number.substring(1));
      this.setState({
        open: true,
        class: "error",
        message: "Enter a valid phone number",
      });
      return;
    }

    const response = await signupUserService(user);
    if(response.status===201){
      this.setState({
        open: true,
        class: "success",
        message: "Registered successfully!",
      });
      this.props.history.push("/signin");
    }
    else if (response.status === 200 && response.data.status==="success") {
      this.setState({
        open: true,
        class: "success",
        message: "Registered successfully! Kindly login!",
      });
      setTimeout(() => {  this.props.history.push("/signin");}, 2500);
      
    } else if (response.status === 200 && response.data.status==='failure') {
      this.setState({
        open: true,
        class: "error",
        message: response.data.message,
      });
    }  else if (response.status === 500) {
      this.setState({
        open: true,
        class: "error",
        message: response.response.data.message,
      });
    }else {
      this.setState({
        open: true,
        class: "error",
        message: "Unknown error occurred",
      });
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      redirectToReferrer: false,
      email: "",
      name: "",
      phone_number: "",
      password: "",
      confirm_password: "",
      gender: "",
      birthday: "",
      username: "",
      message: "",
      open: false,
      class: "",
    };
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleGenderChange(gender) {
    this.setState({ gender: gender });
  }

  handleDOBChange(event) {
    let dob = new Date(event.target.value);
    if (dob < Date.now()) {
      this.setState({
        birthday: event.target.value,
      });

      return;
    }
    this.setState({
      open: true,
      class: "error",
      message: "Date of birth cannot be greater than current date",
    });
    event.target.value = null;
  }

  handleClose = (event, reason) => {
    this.setState({ open: false });
  };
  render() {
    function Alert(props) {
      return <MuiAlert elevation={6} variant="filled" {...props} />;
    }

    return (
      <SignUpStyleWrapper className="mateSignUpPage">
        <div className="mateSignInPageImgPart">
          <div className="mateSignInPageImg">
            <img src={signinImg} alt="Kiwi standing on oval" />
          </div>
        </div>

        <div className="mateSignInPageContent">
          <div className="mateSignInPageLink">
            <Link to="#">
              <button className="mateSignInPageLinkBtn active" type="button">
                Register
              </button>
            </Link>
            <Link to="/signin">
              <button className="mateSignInPageLinkBtn " type="button">
                Login
              </button>
            </Link>
          </div>
          <div>
            <Snackbar open={this.state.open} autoHideDuration={6000}>
              <Alert onClose={this.handleClose} severity={this.state.class}>
                {this.state.message}
              </Alert>
            </Snackbar>
          </div>
          <Scrollbars style={{ height: "100%" }}>
            <div className="mateSignInPageForm">
              <div className="mateInputWrapper">
                <TextField
                  label="Name"
                  placeholder="Name"
                  name="name"
                  margin="normal"
                  onChange={(event) => this.onChange(event)}
                  required
                />
              </div>
              <div className="mateInputWrapper">
                <TextField
                  label="Username"
                  placeholder="Username"
                  name="username"
                  margin="normal"
                  onChange={(event) => this.onChange(event)}
                  required
                />
              </div>
              <div className="mateInputWrapper">
                <TextField
                  label="Email"
                  placeholder="Email"
                  name="email"
                  margin="normal"
                  onChange={(event) => this.onChange(event)}
                  type="Email"
                  required
                />
              </div>
              <div className="mateInputWrapper">
                <TextField
                  label="Phone number (+0000000000)"
                  placeholder="Phone no"
                  name="phone_number"
                  onChange={(event) => this.onChange(event)}
                  margin="normal"
                  required
                />
              </div>
              <div className="mateInputWrapper">
                <div
                  margin="normal"
                  label="Gender"
                  style={{ marginTop: "2rem", color: "rgb(118, 118, 118)" }}
                  required
                >
                  Gender: <br />
                  <input
                    label="Gender"
                    type="radio"
                    value="MALE"
                    name="gender"
                    margin="normal"
                    style={{ marginLeft: "5rem" }}
                    onClick={() => {
                      this.handleGenderChange("M");
                    }}
                  />{" "}
                  Male
                  <input
                    type="radio"
                    value="FEMALE"
                    name="gender"
                    margin="normal"
                    style={{ marginLeft: "2rem" }}
                    onClick={() => {
                      this.handleGenderChange("F");
                    }}
                  />{" "}
                  Female
                </div>
              </div>
              <div className="mateInputWrapper">
                <TextField
                  label="DOB"
                  placeholder=""
                  name="birthday"
                  onChange={(event) => this.handleDOBChange(event)}
                  margin="normal"
                  type="date"
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </div>
              <div className="mateInputWrapper">
                <TextField
                  label="Password"
                  placeholder="Password"
                  name="password"
                  onChange={(event) => this.onChange(event)}
                  margin="normal"
                  type="Password"
                  required
                />
              </div>
              <div className="mateInputWrapper">
                <TextField
                  label="Confirm Password"
                  placeholder="Confirm Password"
                  name="confirm_password"
                  onChange={(event) => this.onChange(event)}
                  margin="normal"
                  type="Password"
                  required
                />
              </div>
            </div>
            <div className="mateAgreement">
              <div className="mateLoginSubmit">
                <Button type="button" onClick={this.handleSignUp}>
                  Sign Up
                </Button>
              </div>
            </div>
          </Scrollbars>
        </div>
      </SignUpStyleWrapper>
    );
  }
}

export default SignUp;
