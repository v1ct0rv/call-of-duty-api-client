import React, { useState } from 'react';
import { Grid, GridColumn, GridToolbar } from "@progress/kendo-react-grid";
import { useQuery } from '@apollo/client';
import { getRebirthStatsQuery } from '../queries/queries';
import moment from "moment";
import { process } from '@progress/kendo-data-query';
import { useLocalStorage } from "../hooks/useLocalStorage";
import { ExcelExport } from '@progress/kendo-react-excel-export';
import { useParams } from "react-router-dom";

const lastWinCell = (props) => {
  const field = props.field || "";
  return (
    <td>
      <span title={moment(props.dataItem[field].date).format('LLL')}><a href={`https://wzstats.gg/match/${props.dataItem[field].matchID}/`} target="_blank" rel="
        noreferrer">{moment(props.dataItem[field].date).fromNow()}</a></span>
    </td>
  );
}

const timePlayedCell = (props) => {
  const field = props.field || "";
  const parsed = secondsToDhms(props.dataItem[field])
  return (
    <td>
      {parsed.d}<span className="small">D </span>{parsed.h}<span className="small">H </span>{parsed.m}<span className="small">MIN </span>
    </td>
  );
}

const StatsGrid = (props) => {
  const { team } = useParams();
  // Load the data
  const { loading, error, data } = useQuery(getRebirthStatsQuery, {
    variables: {
      filter: {
        _operators: {
          date: {
            gte: new Date().toISOString().substring(0, 10) // UTC Date
          },
          teams: {
            in: [
              team.toLowerCase()
            ]
          }
        }
      }
    }
  })

  const _export = React.useRef(null);
  const excelExport = () => {
    if (_export.current !== null) {
      _export.current.save();
    }
  };


  const [statsGridSortField, setStatsGridSortField] = useLocalStorage("statsGridSort", "maxKills");
  const [statsGridSortOrder, setStatsGridSortOrder] = useLocalStorage("statsGridSortOrder", "desc");

  // Declare a new state variable, which we'll call "state"
  const [state, setState] = useState({
    gridDataState: {
      sort: [
        { field: statsGridSortField, dir: statsGridSortOrder }
      ],
      skip: 0,
      take: 20
    }
  }
  );

  const handleGridDataStateChange = (e) => {
    setStatsGridSortField(e.dataState.sort[0]?.field)
    setStatsGridSortOrder(e.dataState.sort[0]?.dir)
    setState({ gridDataState: e.dataState })
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :( </p>;

  return (
    <div className="App">
      <div style={{ width: '95%', margin: "40px auto" }}>
        <ExcelExport data={data.rebirthStatMany} ref={_export}>
          <Grid
            //   style={{
            //       height: "400px",
            //   }}
            data={process(data.rebirthStatMany, state.gridDataState)}
            {...state.gridDataState}
            onDataStateChange={handleGridDataStateChange}
            sortable={true}
          >
            <GridToolbar>
              <button
                title="Export Excel"
                className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
                onClick={excelExport}
              >
                Export to Excel
              </button>
            </GridToolbar>
            <GridColumn field="username" title="Username" width="150px" />
            <GridColumn field="wins" title="Wins" width="80px" />
            <GridColumn field="maxKills" title="Max Kills" width="100px" />
            <GridColumn field="kdRatio" title="KD" format="{0:n2}" width="60px" />
            {/* <GridColumn field="kdRatio" title="KD" cell={props => <td>{props.dataItem[props.field].toFixed(2)}</td>} /> */}
            <GridColumn field="lastWin" title="LastWin" cell={lastWinCell} width="170px" />
            <GridColumn field="kills" title="Kills" width="90px" />
            <GridColumn field="deaths" title="Deaths" width="90px" />
            <GridColumn field="maxKillsWin" title="maxKillsWin" width="100px" />
            <GridColumn field="longestStreak" title="Kill Streak" width="100px" />
            <GridColumn field="longestStreakWin" title="Kill Streak Win" width="120px" />
            <GridColumn field="winsPercent" title="% Wins" width="120px" format="{0:n2} %" />
            <GridColumn field="gamesPerWin" title="gamesPerWin" width="120px" format="{0:n2}" />
            <GridColumn field="timePlayed" title="timePlayed" width="120px" cell={timePlayedCell} />
            <GridColumn field="lastUpdate" title="Last Update" cell={props => <td>{new Date(props.dataItem[props.field]).toLocaleString()}</td>} format="{0:d}" />
          </Grid>
        </ExcelExport>
      </div>
    </div>
  );
};

function secondsToDhms(seconds) {
  seconds = Number(seconds);
  var d = Math.floor(seconds / (3600*24));
  var h = Math.floor(seconds % (3600*24) / 3600);
  var m = Math.floor(seconds % 3600 / 60);
  var s = Math.floor(seconds % 60);

  return {
    d,
    h,
    m,
    s
  }
}

// export default compose(
//     graphql(getRebirthStatsQuery, { name: "getRebirthStatsQuery" })
// )(StatsGrid);

export default StatsGrid;