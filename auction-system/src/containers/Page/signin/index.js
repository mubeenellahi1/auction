import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import signinImg from "../../../images/signup.svg";
import fbBtnSvg from "../../../images/facebook-app-symbol.svg";
import gpBtnSvg from "../../../images/google-plus.svg";
import Button from "../../../components/uielements/button";
import authAction from "../../../redux/auth/actions";
import TextField from "../../../components/uielements/textfield";
import IntlMessages from "../../../components/utility/intlMessages";
import Scrollbars from "../../../components/utility/customScrollBar";
import SignInStyleWrapper from "./signin.style";
import {
    loginUserService,
    googleLoginService,
    facebookLoginService,
} from "../../../services/userServices";
import { store } from "./../../../redux/store.js";
import { loginUserAction } from "../../../redux/actions/userAction";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import { GoogleLogin } from "react-google-login";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";

const { login } = authAction;
const googleClientID =
    "61733361845-j03c3vnkmcutgehstvfhkpa842tamaej.apps.googleusercontent.com";
const facebookAppID = "2491740644463572";
class SignIn extends Component {
    state = {
        username: "hamza",
        password: "123",
        alertOpen: false,
        alertMessage: "",
        alertSeverity: "info",
    };
    handleLogin = async () => {
        const loginServiceResponse = await loginUserService(
            this.state.username,
            this.state.password
        );
        if (loginServiceResponse.status===200) {
            
            if (loginServiceResponse.data.status === "success") {
                this.setState({
                    alertMessage: "Logged-In Successfully",
                    alertSeverity: "success",
                    alertOpen: true,
                });
                localStorage.setItem(
                    "token",
                    loginServiceResponse.data.data.token
                );
                store.dispatch(loginUserAction(loginServiceResponse.data.data));
                this.props.history.push("/dashboard/list-of-products");
            } else if (loginServiceResponse.data.status === "failure") {
                this.setState({
                    alertMessage: loginServiceResponse.data.message,
                    alertSeverity: "error",
                    alertOpen: true,
                });
            } else {
                this.setState({
                    alertMessage: "Unexpected Error Occurred",
                    alertSeverity: "error",
                    alertOpen: true,
                });
            }
        }
        else if(loginServiceResponse.status===401){
            this.setState({
                alertMessage: "Invalid Credentials",
                alertSeverity: "error",
                alertOpen: true,
            });
        }
        else{
            this.setState({
            alertMessage: "Unexpected Error Occurred",
            alertSeverity: "error",
            alertOpen: true,
        });

        }
    };

    handleAlertClose = () => {
        this.setState({ alertOpen: false });
    };

    handleGoogleLogin = async (response) => {
        if (!response.error) {
            const loginServiceResponse = await googleLoginService(
                response.profileObj.givenName,
                response.profileObj.familyName,
                response.profileObj.email,
                response.googleId
            );

            if (loginServiceResponse.status === 200) {
                this.setState({
                    alertMessage: "Logged-In Successfully",
                    alertSeverity: "success",
                    alertOpen: true,
                });
                localStorage.setItem(
                    "token",
                    loginServiceResponse.data.data.token
                );
                store.dispatch(loginUserAction(loginServiceResponse.data.data));
                this.props.history.push("/dashboard/list-of-products");
            } else if (loginServiceResponse.status === 401) {
                this.setState({
                    alertMessage: "Invalid Username or Password",
                    alertSeverity: "error",
                    alertOpen: true,
                });
            } else {
                this.setState({
                    alertMessage: "Unexpected Error Occurred",
                    alertSeverity: "error",
                    alertOpen: true,
                });
            }
        } else {
            this.setState({
                alertMessage: "Error in verifying your Google credentials",
                alertSeverity: "error",
                alertOpen: true,
            });
        }
    };

    handleFacebookLogin = async (response) => {
        if (!response.error) {
            //make the API call
            const loginServiceResponse = await facebookLoginService(
                response.first_name,
                response.last_name,
                response.email,
                response.id
            );

            if (loginServiceResponse.status === 200) {
                this.setState({
                    alertMessage: "Logged-In Successfully",
                    alertSeverity: "success",
                    alertOpen: true,
                });
                localStorage.setItem(
                    "token",
                    loginServiceResponse.data.data.token
                );
                store.dispatch(loginUserAction(loginServiceResponse.data.data));
                this.props.history.push("/dashboard/list-of-products");
            } else if (loginServiceResponse.status === 401) {
                this.setState({
                    alertMessage: "Invalid Username or Password",
                    alertSeverity: "error",
                    alertOpen: true,
                });
            }else if(loginServiceResponse.status===500){
                this.setState({
                    alertMessage: "Error in verifying your Facebook credentials",
                    alertSeverity: "error",
                    alertOpen: true,
                });
            } 
            else {
                this.setState({
                    alertMessage: "Unexpected Error Occurred",
                    alertSeverity: "error",
                    alertOpen: true,
                });
            }
        } else {
            this.setState({
                alertMessage: "Unexpected Error Occurred",
                alertSeverity: "error",
                alertOpen: true,
            });
        }
    };

    onChangeUsername = (event) =>
        this.setState({ username: event.target.value });
    onChangePassword = (event) =>
        this.setState({ password: event.target.value });
    render() {
        const from = { pathname: "/dashboard/list-of-products" };
        const { redirectToReferrer, username, password } = this.state;

        if (redirectToReferrer) {
            return <Redirect to={from} />;
        }
        return (
            <SignInStyleWrapper className="mateSignInPage">
                <div className="mateSignInPageImgPart">
                    <div className="mateSignInPageImg">
                        <img src={signinImg} alt="Kiwi standing on oval" />
                    </div>
                </div>

                <div className="mateSignInPageContent">
                    <div className="mateSignInPageLink">
                        <Link to="/signup">
                            <button
                                className="mateSignInPageLinkBtn"
                                type="button"
                            >
                                Register
                            </button>
                        </Link>
                        <Link to="#">
                            <button
                                className="mateSignInPageLinkBtn active"
                                type="button"
                            >
                                Login
                            </button>
                        </Link>
                    </div>
                    <div>
                        <Snackbar
                            open={this.state.alertOpen}
                            autoHideDuration={6000}
                            onClose={this.handleAlertClose}
                        >
                            <Alert
                                elevation={6}
                                variant="filled"
                                onClose={this.handleAlertClose}
                                severity={this.state.alertSeverity}
                            >
                                {this.state.alertMessage}
                            </Alert>
                        </Snackbar>
                    </div>
                    <Scrollbars style={{ height: "100%" }}>
                        <div className="mateSignInPageGreet">
                            <h1>Hello User,</h1>
                            <p>
                                Welcome to UNDEDY, Please Login with your
                                personal account information.
                            </p>
                        </div>
                        <div className="mateSignInPageForm">
                            <div className="mateInputWrapper">
                                <TextField
                                    label="Username"
                                    placeholder="Username"
                                    margin="normal"
                                    value={username}
                                    onChange={this.onChangeUsername}
                                />
                            </div>
                            <div className="mateInputWrapper">
                                <TextField
                                    label="Password"
                                    placeholder="Password"
                                    margin="normal"
                                    type="Password"
                                    value={password}
                                    onChange={this.onChangePassword}
                                />
                            </div>
                            <div className="mateLoginSubmit">
                                <Button
                                    type="button"
                                    onClick={this.handleLogin}
                                >
                                    Login
                                </Button>
                            </div>
                        </div>
                        <div className="mateLoginSubmitText">
                            <span>
                                * Username: demo@gmail.com , Password: demodemo
                                or click on any button.
                            </span>
                        </div>
                        <div className="mateLoginOtherBtn">
                            <div className="mateLoginOtherBtnWrap">
                                <FacebookLogin
                                    appId={facebookAppID}
                                    //autoLoad
                                    fields="first_name,last_name,email"
                                    // scope="public_profile,user_friends,user_actions.books"
                                    callback={this.handleFacebookLogin}
                                    render={(renderProps) => (
                                        // <button onClick={renderProps.onClick}>This is my custom FB button</button>
                                        <Button
                                            onClick={renderProps.onClick}
                                            type="button"
                                            variant="contained"
                                            className="btnFacebook"
                                        >
                                            <div className="mateLoginOtherIcon">
                                                <img
                                                    src={fbBtnSvg}
                                                    alt="facebook Btn"
                                                />
                                            </div>
                                            <IntlMessages id="page.signInFacebook" />
                                        </Button>
                                    )}
                                />
                            </div>
                            <div className="mateLoginOtherBtnWrap">
                                <GoogleLogin
                                    clientId={googleClientID}
                                    //
                                    render={(renderProps) => (
                                        // <button onClick={renderProps.onClick} disabled={renderProps.disabled}>This is my custom Google button</button>
                                        <Button
                                            onClick={renderProps.onClick}
                                            type="button"
                                            className="btnGooglePlus"
                                        >
                                            <div className="mateLoginOtherIcon">
                                                <img
                                                    src={gpBtnSvg}
                                                    alt="Google Plus Btn"
                                                />
                                            </div>
                                            <IntlMessages id="page.signInGooglePlus" />
                                        </Button>
                                    )}
                                    onSuccess={this.handleGoogleLogin}
                                    onFailure={this.handleGoogleLogin}
                                    // cookiePolicy={'single_host_origin'}
                                ></GoogleLogin>
                            </div>
                        </div>
                    </Scrollbars>
                </div>
            </SignInStyleWrapper>
        );
    }
}
export default connect(
    (state) => ({
        isLoggedIn: state.Auth.idToken !== null ? true : false,
    }),
    { login }
)(SignIn);
