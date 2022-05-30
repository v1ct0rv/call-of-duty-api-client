import {  gql } from "@apollo/client";

const getRebirthStatsQuery = gql`
  query ($filter: FilterFindManyrebirthstatsInput!) {
    rebirthStatMany(filter: $filter) {
      username
      wins
      kdRatio
      kills
      deaths
      winsPercent
      gamesPerWin
      timePlayed
      lastWin {
        matchID
        date
      }
      lastUpdate
      longestStreak
      longestStreakWin
      maxKills
      maxKillsWin
    }
  }
`

const getBrStatsQuery = gql`
  query ($filter: FilterFindManybrstatsInput!) {
    brStatMany(filter: $filter) {
      lastUpdate
      username
      br {
        wins
        kdRatio
        kills
        deaths
        winsPercent
        gamesPerWin
        timePlayed
        lastWin {
          matchID
          date
        }
        longestStreak
        longestStreakWin
        maxKills
        maxKillsWin
      }
    }
}
`

export { getBrStatsQuery, getRebirthStatsQuery };