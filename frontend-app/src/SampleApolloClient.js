import './App.css';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql
} from "@apollo/client";

const client = new ApolloClient({
  uri: 'http://localhost:5000/graphql',
  cache: new InMemoryCache()
});

const BR_STATS = gql`
  query {
    brStatMany {
      date
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
      }
    }
  }
`;

function SampleApolloClient() {
  return (
    <ApolloProvider client={client}>
      <div>
        <h2>My first Apollo app 🚀</h2>
        <ExchangeRates />
      </div>
  </ApolloProvider>
  );
}

function ExchangeRates() {
  const { loading, error, data } = useQuery(BR_STATS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  console.log("NOjoda");
  console.log(data);

  return data.brStatMany.map(({ username }) => (
    <div key={username}>
      <p>
        {username}
      </p>
    </div>
  ));
}


export default SampleApolloClient;
