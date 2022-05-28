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
  query($page: Int, $perPage: Int, $sort: SortFindManybrstatsInput, $filter:  FilterFindManybrstatsInput){
    brStatPagination(page: $page, perPage: $perPage, sort: $sort, filter: $filter) {
      count
      pageInfo {
        pageCount
        itemCount
        hasNextPage
        hasPreviousPage
      }
      items {
        lastUpdate
        platform
        username
        teams
        br {
          wins
          kills
          deaths
          kdRatio
          timePlayed
          gamesPlayed
          downs
          revives
          scorePerMinute
          topFive
          topTen
          topTwentyFive
          winsPercent
          killsPerGame
          gamesPerWin
          killsPerMin
          lastWin {
            matchID
            date
            playerStats {
              kills
              deaths
              kdRatio
              gulagDeaths
            }
          }
        }
      }
    }
  }
`

export { getBrStatsQuery, getRebirthStatsQuery };