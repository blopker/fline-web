import React from "react";
import ReactDOM from "react-dom";
import * as firebase from "firebase/app";
import "firebase/performance";
import * as Sentry from "@sentry/browser";
import { db } from "./db";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import "./index.css";

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCHoMWa-QPsR3NVlQo2CwfuRYSVjh_f8Qw",
  authDomain: "fline-app.firebaseapp.com",
  databaseURL: "https://fline-app.firebaseio.com",
  projectId: "fline-app",
  storageBucket: "fline-app.appspot.com",
  messagingSenderId: "521831526402",
  appId: "1:521831526402:web:5b9ce81608685e46"
};

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: "https://0c534e386e7e4f27bf3e13c28dec0575@sentry.io/1454732"
  });
  firebase.initializeApp(firebaseConfig);
  firebase.performance();
}

ReactDOM.render(<App db={db} />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
