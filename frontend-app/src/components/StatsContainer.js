import * as React from 'react';
import StatsGrid from "./StatsGrid"
import { TabStrip, TabStripTab } from '@progress/kendo-react-layout';
import { useParams } from "react-router-dom";
import ReactGA from 'react-ga';
import { useHistory } from "react-router-dom";

const StatsContainer = (props) => {

  let history = useHistory();

  const { team, mode } = useParams();

  const selectedTab = mode === 'br' ? 0 : 1;

  const [selected, setSelected] = React.useState(selectedTab);

  const handleSelect = e => {
    if (e.selected === 1) {
      ReactGA.pageview((window.location.pathname + window.location.search).replace("br", "rebirth"));
    } else {
      ReactGA.pageview((window.location.pathname + window.location.search));
    }
    setSelected(e.selected);
    history.push(`/${team}/${e.selected === 1 ? 'rebirth' : 'br'}`);
  };

  return (
    <div className="App">
      <div style={{ width: '95%', margin: "40px auto" }}>
        <TabStrip selected={selected} onSelect={handleSelect}>
          <TabStripTab title="BR" key="1">
            <StatsGrid mode="br" team={team} />
          </TabStripTab>
          <TabStripTab title="Rebirth" key="2">
            <StatsGrid mode="rebirth" team={team} />
          </TabStripTab>
        </TabStrip>
      </div></div>
  )
}

export default StatsContainer