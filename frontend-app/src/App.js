import './App.css';
import Table from "./components/Table"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

function App() {
  return (
    <Router>
      <div>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/hackzone">
            <div className="App">
              <div style={{width:'95%',margin:"40px auto"}}>
                <Table team="Hackzone" />
              </div>
            </div>
          </Route>
          <Route path="/warzone">
            <div className="App">
              <div style={{width:'95%',margin:"40px auto"}}>
                <Table team="Warzone" />
              </div>
            </div>
          </Route>
          <Route path="/a-team">
            <div className="App">
              <div style={{width:'95%',margin:"40px auto"}}>
                <Table team="A-Team" />
              </div>
            </div>
          </Route>
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
              </ul>
            </nav>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
