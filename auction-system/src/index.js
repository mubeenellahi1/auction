import React from "react";
import ReactDOM from "react-dom";
import MaterialAdmin from "./materialAdmin";
import * as serviceWorker from "./serviceWorker";
import { PersistGate } from "redux-persist/integration/react";
import {persistor} from './redux/store.js'

ReactDOM.render(
    <PersistGate loading={null} persistor={persistor}>
        <MaterialAdmin />
    </PersistGate>,
    document.getElementById("root")
);

console.warn = () => {};

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
