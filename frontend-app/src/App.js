// import '@progress/kendo-theme-default/dist/all.css';
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
import { useThemeSwitcher } from "react-css-theme-switcher";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { ThemeSwitcherProvider } from "react-css-theme-switcher";
import { DropDownList } from "@progress/kendo-react-dropdowns";

export const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache()
});

const TRACKING_ID = "UA-76639346-2"; // OUR_TRACKING_ID

const themes = {
  dark: `${process.env.PUBLIC_URL}/css/dark-theme.css`,
  light: `${process.env.PUBLIC_URL}/css/light-theme.css`,
  "default-main-dark": `${process.env.PUBLIC_URL}/css/default-main-dark.css`,
  "material-main-dark": `${process.env.PUBLIC_URL}/css/material-main-dark.css`,
  "bootstrap-main-dark": `${process.env.PUBLIC_URL}/css/bootstrap-main-dark.css`,
};

const defaultTheme = { "key": "dark", "value": "/css/dark-theme.css" };

const themesArray = Object.keys(themes)
  .map(function (key) {
    return { key, value: themes[key] };
  });

function App() {
  ReactGA.initialize(TRACKING_ID);

  const [theme, setTheme] = useLocalStorage("theme", defaultTheme);

  const { switcher, currentTheme, status } = useThemeSwitcher();

  const toggleTheme = (event) => {
    setTheme(event.target.value);
    switcher({ theme: event.target.value.key });
  };

  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  // Avoid theme change flicker
  if (status === "loading") {
    return null;
  }

  console.log(currentTheme);

  return (
    <div className="main fade-in k-body" style={{ height: "100%" }}>
      <ApolloProvider client={client}>
        <Router>
          <div>
            <div >
              <span>Theme: </span>
              <DropDownList
                style={{
                  width: "300px",
                }}
                data={themesArray}
                textField="key"
                dataItemKey="key"
                value={theme}
                onChange={toggleTheme}
              />
            </div>
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
    </div>
  );
}

function RootApp() {
  const [theme] = useLocalStorage("theme", defaultTheme);

  return (
    <ThemeSwitcherProvider
      themeMap={themes}
      defaultTheme={theme.key}
    // insertionPoint="styles-insertion-point"
    >
      <App />
    </ThemeSwitcherProvider>

  )
}

export default RootApp;
