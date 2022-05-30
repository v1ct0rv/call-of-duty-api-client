import * as React from 'react';
import StatsGrid from "./StatsGrid"
import { TabStrip, TabStripTab } from '@progress/kendo-react-layout';
import { useParams } from "react-router-dom";

const StatsContainer = (props) => {

  const { team, mode } = useParams();

  const selectedTab = mode === 'br' ? 0 : 1;

  const [selected, setSelected] = React.useState(selectedTab);

  const handleSelect = e => {
    setSelected(e.selected);
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