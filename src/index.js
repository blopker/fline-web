import React from "react";
import ReactDOM from "react-dom";
import * as Sentry from "@sentry/browser";
import { db } from "./db";
import { Firebase } from "./firebase";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import "./index.css";
import initSync from "./sync";

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: "https://c1ab222f1c35420a9c4223322450f51e@sentry.io/1765618",
    release: process.env.REACT_APP_COMMIT_REF
  });
}

const fb = new Firebase();

initSync(db, fb);

ReactDOM.render(<App db={db} fb={fb} />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
