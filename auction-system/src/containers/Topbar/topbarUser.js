import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import IntlMessages from '../../components/utility/intlMessages';
import TopbarDropdownWrapper from './topbarDropdown.style';
import {
  IconButtons,
  TopbarDropdown,
  UserInformation,
  SettingsList,
  Icon,
} from './topbarDropdown.style';
import authAction from '../../redux/auth/actions';
import Image from '../../images/user.jpg';
import {store} from '../../redux/store'
import {clearCartAction} from '../../redux/actions/cartAction';
import { logoutUserAction } from '../../redux/actions/userAction';


const { logout } = authAction;

class TopbarUser extends Component {
  state = {
    visible: false,
    anchorEl: null,
  };
  hide = () => {
    this.setState({ visible: false });
  };
  handleVisibleChange = () => {
    this.setState({
      visible: !this.state.visible,
      anchorEl: findDOMNode(this.button),
    });
  };

  handleLogout=()=>{
    store.dispatch(clearCartAction());
    store.dispatch(logoutUserAction());
    localStorage.removeItem("token");
    this.props.logout();
  }


  render() {
    const content = (
      <TopbarDropdown>
        <UserInformation>
          <div className="userImage">
            <img src={Image} alt="user" />
          </div>

          <div className="userDetails">
    <h3>{store.getState().user.name}</h3>
    <p>{store.getState().user.email}</p>
          </div>
        </UserInformation>

        <SettingsList>
          <a href="#!" className="dropdownLink">
            <Icon>settings</Icon>
            <IntlMessages id="themeSwitcher.settings" />
          </a>
          <a href="#!" className="dropdownLink">
            <Icon>help</Icon>
            <IntlMessages id="sidebar.feedback" />
          </a>
          <a href="#!" className="dropdownLink">
            <Icon>feedback</Icon>
            <IntlMessages id="topbar.help" />
          </a>
          <Link to="/" onClick={this.handleLogout} className="dropdownLink">
            <Icon>input</Icon>
            <IntlMessages id="topbar.logout" />
          </Link>
        </SettingsList>
      </TopbarDropdown>
    );
    return (
      <div id="topbarUserIcon">
        <IconButtons
          ref={node => {
            this.button = node;
          }}
          onClick={this.handleVisibleChange}
        >
          <div className="userImgWrapper">
            <img src={Image} alt="#" />
          </div>
        </IconButtons>

        <TopbarDropdownWrapper
          open={this.state.visible}
          anchorEl={this.state.anchorEl}
          onClose={this.hide}
          // marginThreshold={66}
          className="userPopover"
          anchorOrigin={{
            horizontal: 'right',
            vertical: 'top',
          }}
          transformOrigin={{
            horizontal: 'right',
            vertical: 'bottom',
          }}
        >
          {content}
        </TopbarDropdownWrapper>
      </div>
    );
  }
}

export default connect(
  state => ({
    ...state.App,
    customizedTheme: state.ThemeSwitcher.topbarTheme,
  }),
  { logout }
)(TopbarUser);
