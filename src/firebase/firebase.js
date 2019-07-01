import app from "firebase/app";
import "firebase/performance";
import "firebase/auth";

var config;
if (process.env.NODE_ENV === "production") {
  config = {
    apiKey: "AIzaSyCHoMWa-QPsR3NVlQo2CwfuRYSVjh_f8Qw",
    authDomain: "firebase-web.fline.ai",
    databaseURL: "https://fline-app.firebaseio.com",
    projectId: "fline-app",
    storageBucket: "fline-app.appspot.com",
    messagingSenderId: "521831526402",
    appId: "1:521831526402:web:5b9ce81608685e46"
  };
} else {
  config = {
    apiKey: "AIzaSyCNN8dOITJXNTPvLF0RNWCgVlMqhHrzBpw",
    authDomain: "firebase-web.fline.ai",
    databaseURL: "https://fline-app-dev.firebaseio.com",
    projectId: "fline-app-dev",
    storageBucket: "",
    messagingSenderId: "213415012311",
    appId: "1:213415012311:web:e90269ceed17ee3d"
  };
}

class Firebase {
  constructor() {
    app.initializeApp(config);
    app.performance();
    this.app = app;
    this.auth = app.auth();
  }
}

export default Firebase;
