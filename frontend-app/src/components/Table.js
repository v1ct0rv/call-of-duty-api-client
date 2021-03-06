import React, { forwardRef } from "react";
import MaterialTable from "material-table";
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import { client, getBrStats } from "./graphql";
import moment from "moment";
import { useParams } from "react-router-dom";

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const tableColumnConfig = [{
  title: 'User name',
  field: 'username',
},
// {
//   title: 'Platform',
//   field: 'platform',
//   sorting: false,
// },
{
  title: 'Wins',
  field: 'br.wins',
  type: 'numeric',
},
{
  title: 'KD',
  field: 'br.kdRatio',
  type: 'numeric',
  render: rowData => rowData.br.kdRatio.toFixed(2),
  defaultSort: 'desc',
},
{
  title: 'LastWin',
  field: 'br.lastWin.date',
  type: 'datetime',
  render: rowData => {
    if (rowData.br.lastWin.matchID) {
      return <span title={moment(rowData.br.lastWin.date).format('LLL')}><a href={`https://wzstats.gg/match/${rowData.br.lastWin.matchID}/`} target="_blank" rel="noreferrer">{moment(rowData.br.lastWin.date).fromNow()}</a></span>
    }

    return <span>Not Available yet</span>
  },
},
{
  title: 'Games',
  field: 'br.gamesPlayed',
  type: 'numeric',
},
{
  title: '% Wins',
  field: 'br.winsPercent',
  type: 'numeric',
  render: rowData => rowData.br.winsPercent.toFixed(2),
},
{
  title: 'Games x Win',
  field: 'br.gamesPerWin',
  type: 'numeric',
  render: rowData => rowData.br.gamesPerWin.toFixed(2),
},
{
  title: 'Time Played',
  field: 'br.timePlayed',
  type: 'numeric',
  render: rowData => {
    const parsed = secondsToDhms(rowData.br.timePlayed)
    return <div>{parsed.d}<span className="small">D </span>{parsed.h}<span className="small">H </span>{parsed.m}<span className="small">MIN </span></div>
  },
},
{
  title: 'Kills',
  field: 'br.kills',
  type: 'numeric',
},
{
  title: 'Deaths',
  field: 'br.deaths',
  type: 'numeric',
},
{
  title: 'Kills x Game',
  field: 'br.killsPerGame',
  type: 'numeric',
  render: rowData => rowData.br.killsPerGame.toFixed(2),
},
{
  title: 'Kills x Min',
  field: 'br.killsPerMin',
  type: 'numeric',
  render: rowData => rowData.br.killsPerMin.toFixed(2),
},
{
  title: 'Top 5',
  field: 'br.topFive',
  type: 'numeric',
},
{
  title: 'Top 10',
  field: 'br.topTen',
  type: 'numeric',
},
{
  title: 'Top 25',
  field: 'br.topTwentyFive',
  type: 'numeric',
},
{
  title: 'LastUpdate',
  field: 'lastUpdate',
  type: 'time',
  sorting: false,
}
]

let teamName;

const Table = (props) => {
  const { team } = useParams();
  teamName = team

  return (
    <div className="App">
      <div style={{ width: '95%', margin: "40px auto" }}>
        <div>
          <MaterialTable
            icons={tableIcons}
            columns={tableColumnConfig}
            data={remoteData}
            title={teamName + " Team"}
            options={{
              toolbar: true,
              sorting: true,
              draggable: true,
              pageSize: 20,
              thirdSortClick: false,
              exportButton: true
            }}
          />
        </div>
      </div>
    </div>
  )
}

const remoteData = (query) => {
  //console.log("Query object - ", query)
  return client.query({
    query: getBrStats,
    variables: {
      page: 0,
      perPage: 50,
      sort: resolveSort(query),
      filter: resolveFilter(query),
    }
  }).then((res) => {
    //console.dir(query)
    return {
      data: JSON.parse(JSON.stringify(res.data.brStatPagination.items)), // this map is to avoid the error Cannot add property tableData, object is not extensible
      page: query.page,
      totalCount: res.data.brStatPagination.count
    }
  })
}

function resolveSort(query) {
  if (!query.orderBy) return "BR__KDRATIO_DESC"

  if (query.orderDirection === 'asc') {
    return `${query.orderBy.field.toUpperCase().replaceAll('.', '__')}_ASC`
  }
  return `${query.orderBy.field.toUpperCase().replaceAll('.', '__')}_DESC`
}

function resolveFilter(query) {
  let filter = {
    _operators: {
      date: {
        gte: new Date().toISOString().substring(0, 10) // UTC Date
      },
      teams: {
        in: teamName.toLowerCase()
      }
    }
  }

  if (!query.search || query.search === '') return filter

  filter._operators.username = {
    regex: query.search
  }

  return filter
}

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

export default Table;
