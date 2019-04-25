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

  async function addGraph(graphData) {
    // Convert the digitizer X coordinates into ISO date format
    const dateTimeFormatter = ({ x, y }) => {
      const d = new Date(date);
      // Convert fractional hours into HH:MM (eg: 10.5 -> 10:30)
      d.setHours(0, 0, x * 3600, 0);
      return {
        x: d.toISOString(),
        y: y
      };
    };
    const formattedGraphData = graphData.map(dateTimeFormatter);
    const newDay = day.set("graph", formattedGraphData);
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
          render={() => (
            <Log day={day} date={date} setDate={setDate} addGraph={addGraph} />
          )}
        />
        <Route
          exact
          path="/create/"
          render={() => <Edit date={date} addEvent={addEvent} />}
        />
        <Route
          exact
          path="/edit/:id"
          render={history => {
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
