import React, { Component } from "react";
import { connect } from "react-redux";
import Icon from "../../components/uielements/icon";
import appActions from "../../redux/app/actions";
import themeActions from "../../redux/themeSwitcher/actions";
import { AppHolder, Toolbar, IconButtons, TopbarComponents } from "./style";
// import TopbarSearch from "./topbarSearch";
import TopbarUser from "./topbarUser";
import SellerPopupModal from "./customPopupModals/sellerPopupModal";
import BuyCoinPopupModal from "./customPopupModals/buyCoinPopupModal";
import CartBadge from './customPopupModals/cartBadge';
import { store } from "../../redux/store";

const { toggleCollapsed } = appActions;
const { switchActivation } = themeActions;

class Topbar extends Component {
    render() {
        const {
            toggleCollapsed,
            locale,
            url,
            customizedTheme,
        } = this.props;
        const propsTopbar = { locale, url };
        return (
            <AppHolder style={{ background: customizedTheme.backgroundColor }}>
                <Toolbar
                    style={{
                        paddingLeft: "30px",
                        minHeight: "64px",
                        background: customizedTheme.topbarTheme,
                    }}
                >
                    <IconButtons
                        id="topbarCollapsed"
                        aria-label="open drawer"
                        onClick={toggleCollapsed}
                        className="right"
                    >
                        <Icon>menu</Icon>
                    </IconButtons>

                    <TopbarComponents>
                        <ul className="topbarItems">

                            <li className="topbarNotification">
                                
                                <BuyCoinPopupModal />
                            </li>

                            {!store.getState().user.is_seller && (
                                <li>
                                    <SellerPopupModal></SellerPopupModal>
                                </li>
                            )}

                            <li>
                              <CartBadge/>
                            </li>

                            <li className="topbarUser">
                                <TopbarUser {...propsTopbar} />
                            </li>
                        </ul>
                    </TopbarComponents>
                </Toolbar>
            </AppHolder>
        );
    }
}

export default connect(
    (state) => ({
        ...state.App,
        locale: state.LanguageSwitcher.language.locale,
        customizedTheme: state.ThemeSwitcher.topbarTheme,
    }),
    { toggleCollapsed, switchActivation }
)(Topbar);
