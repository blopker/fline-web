import React, { useState, useEffect } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Edit from "./edit/EditScreen";
import Log from "./log/LogScreen";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Theme from "./Theme";
import initDB from "./db";
// import process from "./digitizer";

const db = initDB();

function App() {
  const [date, setDate] = useState(new Date());
  const [day, setDay] = useState();

  useEffect(() => {
    async function getDay() {
      let day = await db.days.get(date.toLocaleDateString());
      setDay(day);
    }
    getDay();
  }, [day]);

  return (
    <Router>
      <Theme>
        <CssBaseline />
        <Route
          exact
          path="/"
          component={() => <Log day={day} date={date} setDate={setDate} />}
        />
        <Route exact path="/edit" component={() => <Edit date={date} />} />
      </Theme>
    </Router>
  );
}
export default App;
