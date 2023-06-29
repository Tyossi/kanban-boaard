import React from "react";
import { AnimatePresence } from "framer-motion";
import { Routes, Route, useLocation } from "react-router-dom";
import TicketDetails from "./components/TicketDetails/TicketDetails.component";
import "./App.css";
import Main from "./components/Main/Main.component";

function App() {
  const location = useLocation();

  return (
    <AnimatePresence exitBeforeEnter>
      <div className="App">
        <Routes location={location} key={location.key}>
          <Route path="/" element={<Main />}>
            {[
              { name: "/todoTickets/:id", endPoint: "todoTickets" },
              { name: "/onGoingTickets/:id", endPoint: "onGoingTickets" },
              { name: "/qaTickets/:id", endPoint: "qATickets" },
              { name: "/doneTickets/:id", endPoint: "doneTickets" },
            ].map((path) => (
              <Route
                key={path.endPoint}
                path={path.name}
                element={<TicketDetails endPoint={path.endPoint} />}
              />
            ))}
          </Route>
        </Routes>
      </div>
    </AnimatePresence>
  );
}

export default App;
