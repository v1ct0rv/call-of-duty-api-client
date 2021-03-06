import React, { useState } from 'react';
import { Grid, GridColumn, GridToolbar } from "@progress/kendo-react-grid";
import { useQuery } from '@apollo/client';
import { getBrStatsQuery, getRebirthStatsQuery } from '../queries/queries';
import moment from "moment";
import { process } from '@progress/kendo-data-query';
import { useLocalStorage } from "../hooks/useLocalStorage";
import { ExcelExport } from '@progress/kendo-react-excel-export';
import { SvgIcon } from "@progress/kendo-react-common";
import { hyperlinkOpenSmIcon } from "@progress/kendo-svg-icons";
import { Button } from "@progress/kendo-react-buttons";
import ReactGA from 'react-ga';

const lastWinCell = (props) => {
  const field = "lastWin" //props.field || "";
  if (props.dataItem[field] && props.dataItem[field].matchID) {
    return (
      <td>
        <span title={moment(props.dataItem[field].date).format('LLL')}><a href={`https://wzstats.gg/match/${props.dataItem[field].matchID}/`} target="_blank" rel="
          noreferrer">{moment(props.dataItem[field].date).fromNow()} <SvgIcon icon={hyperlinkOpenSmIcon} size="small" /></a></span>
      </td>
    );
  } else {
    return (
      <td>
        Never
      </td>
    )
  }
}

const winIsWinCell = (props) => {
  if (props.dataItem["lastWinIsWinMatchId"]) {
    return (
      <td>
        <span title={moment(props.dataItem["lastWinIsWinDate"]).format('LLL')}><a href={`https://wzstats.gg/match/${props.dataItem["lastWinIsWinMatchId"]}/`} target="_blank" rel="
          noreferrer">{props.dataItem["winIsWin"]} <SvgIcon icon={hyperlinkOpenSmIcon} size="small" /></a></span>
      </td>
    );
  } else {
    return (
      <td>
        {props.dataItem["winIsWin"]}
      </td>
    );
  }
}

const maxWinsInDayCell = (props) => {
  return (
    <td>
      <span title={moment(props.dataItem["maxWinsInDayDate"]).format('MMMM Do YYYY')}>{props.dataItem["maxWinsInDayCount"]}</span>
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
  const mode = props.mode
  const team = props.team

  let query
  if (mode === 'br') {
    query = getBrStatsQuery
  } else {
    query = getRebirthStatsQuery
  }

  // Load the data
  const { loading, error, data, refetch } = useQuery(query, {
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

  const handleReresh = () => {
    ReactGA.event({
      category: 'Refresh',
      action: `Refresh data team ${team} ${mode} Stats`
    });
    refetch()
  }

  const _export = React.useRef(null);
  const excelExport = () => {
    ReactGA.event({
      category: 'Export',
      action: `Excel Export team ${team} ${mode} Stats`
    });
    if (_export.current !== null) {
      _export.current.save();
    }
  };


  const [statsGridSortField, setStatsGridSortField] = useLocalStorage("statsGridSort", "maxWinsInDayCount");
  const [statsGridSortOrder, setStatsGridSortOrder] = useLocalStorage("statsGridSortOrder", "desc");

  // Declare a new state variable, which we'll call "state"
  const [state, setState] = useState({
    gridDataState: {
      sort: [
        { field: statsGridSortField, dir: statsGridSortOrder }
      ],
      skip: 0,
      take: 50
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

  // Parse data
  let gridData
  if (mode === 'br') {
    gridData = data.brStatMany.map(x => {
      let tempData = { ...x.br }
      tempData.lastUpdate = x.lastUpdate
      tempData.username = x.username
      return tempData
    })
  } else {
    gridData = data.rebirthStatMany
  }

  return (
    <ExcelExport data={gridData} ref={_export}>
      <Grid
        //   style={{
        //       height: "400px",
        //   }}
        data={process(gridData, state.gridDataState)}
        {...state.gridDataState}
        onDataStateChange={handleGridDataStateChange}
        sortable={true}
        reorderable={true}
      >
        <GridToolbar>
          <Button icon='refresh' title="Refresh" onClick={handleReresh} className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary">
            Refresh Data
          </Button >
          <Button icon='excel'
            title="Export Excel"
            className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
            onClick={excelExport}
          >
            Export to Excel
          </Button>
        </GridToolbar>
        <GridColumn field="username" title="Username" width="150px" />
        <GridColumn field="wins" title="Wins" width="80px" />
        <GridColumn field="maxKills" title="Max Kills Match" width="140px" />
        <GridColumn field="kdRatio" title="KD" format="{0:n2}" width="60px" />
        {/* <GridColumn field="kdRatio" title="KD" cell={props => <td>{props.dataItem[props.field].toFixed(2)}</td>} /> */}
        <GridColumn field="lastWin.date" title="LastWin" cell={lastWinCell} width="170px" />
        <GridColumn field="winIsWin" title="WinIsWin" cell={winIsWinCell} width="100px" />
        <GridColumn field="maxWinsInDayCount" title="Max Wins in Day" cell={maxWinsInDayCell} width="150px" />
        <GridColumn field="kills" title="Kills" width="80px" />
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
  );
};

function secondsToDhms(seconds) {
  seconds = Number(seconds);
  var d = Math.floor(seconds / (3600 * 24));
  var h = Math.floor(seconds % (3600 * 24) / 3600);
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
