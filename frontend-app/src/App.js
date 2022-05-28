import '@progress/kendo-theme-default/dist/all.css';
import './App.css';
import Table from "./components/Table"
import StatsGrid from "./components/StatsGrid"
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

export const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache()
});


function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div>
          {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/:team" exact children={<Table/>} />
            <Route path="/:team/rebirth" children={<StatsGrid/>} />
            <Route path="/">
              Please Select your Team:
              <nav>
                <ul>
                  <li>
                    <Link to="/hackzone">Hackzone</Link>
                  </li>
                  <li>
                    <Link to="/warzone">Warzone</Link>
                  </li>
                  <li>
                    <Link to="/a-team">A-Team</Link>
                  </li>
                  <li>
                    <Link to="/ortonators">Ortonators</Link>
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
