import React from "react";
import Icon from "../../../components/uielements/icon";
import cartIcon from "./../../../images/cart_icon.png";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";
import './cartBadge.css';
import {useSelector} from 'react-redux';
import { useHistory } from "react-router";

export default function CartBadge() {

    const itemCount = useSelector(state=>state.cart.length)

    let history = useHistory();
    function handleCartClick(){
        history.replace('/dashboard/cart-detail')
        
    }

    return (
        <div>
            <NotificationBadge className="cartBadge" count={itemCount} effect={Effect.SCALE} />
            <Icon onClick={handleCartClick}>
                <img
                    style={{height:'inherit', width:'inherit'}}
                    src={cartIcon}
                    alt=""
                ></img>
            </Icon>
        </div>
    );
}
