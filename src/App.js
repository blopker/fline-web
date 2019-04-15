import React, { useState, useEffect } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Edit from "./edit/EditScreen";
import Log from "./log/LogScreen";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Theme from "./Theme";
import initDB from "./db";
import Immutable from "immutable";
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
  }, [date]);

  async function saveDay(newDay) {
    await db.days.set(date.toLocaleDateString(), newDay);
    newDay = await db.days.get(date.toLocaleDateString());
    setDay(newDay);
  }

  async function addEvent(event, index = null) {
    event = Immutable.fromJS(event);
    let events = day.get("events");
    if (index !== null) {
      events = events.set(index, event);
    } else {
      events = events.push(event);
    }
    const newDay = day.set("events", events);
    await saveDay(newDay);
  }

  if (!day) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Theme>
        <CssBaseline />
        <Route
          exact
          path="/"
          component={() => <Log day={day} date={date} setDate={setDate} />}
        />
        <Route
          exact
          path="/create/"
          component={() => <Edit date={date} addEvent={addEvent} />}
        />
        <Route
          exact
          path="/edit/:id"
          component={history => {
            let match = parseInt(history.match.params.id, 10);
            return (
              <Edit
                eventID={match}
                event={day.get("events").get(match)}
                date={date}
                addEvent={addEvent}
              />
            );
          }}
        />
      </Theme>
    </Router>
  );
}
export default App;
