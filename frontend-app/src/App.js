import '@progress/kendo-theme-default/dist/all.css';
import './App.css';
import React, { useEffect } from 'react';
import StatsContainer from "./components/StatsContainer"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";
import ReactGA from 'react-ga';

export const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache()
});

const TRACKING_ID = "UA-76639346-2"; // OUR_TRACKING_ID

function App() {
  ReactGA.initialize(TRACKING_ID);

  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  return (
    <ApolloProvider client={client}>
      <Router>
        <div>
          {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
          <Switch>
            {/* <Route path="/:team" exact children={<Table/>} /> */}
            <Route path="/:team/:mode" children={<StatsContainer />} />
            <Route path="/">
              Please Select your Team:
              <nav>
                <ul>
                  <li>
                    <Link to="/hackzone/br">Hackzone</Link>
                  </li>
                  <li>
                    <Link to="/warzone/br">Warzone</Link>
                  </li>
                  <li>
                    <Link to="/a-team/br">A-Team</Link>
                  </li>
                  <li>
                    <Link to="/ortonators/br">Ortonators</Link>
                  </li>
                </ul>
              </nav>
            </Route>
          </Switch>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
