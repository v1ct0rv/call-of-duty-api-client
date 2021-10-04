import {
  ApolloClient,
  InMemoryCache,
  gql,
} from "@apollo/client";

export const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache()
});

export const getBrStats = gql`
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
        }
      }
    }
  }
`;
