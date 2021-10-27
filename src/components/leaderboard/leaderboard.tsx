import React from "react";
import { LeaderboardApi } from "./api";

function MovieList(props: any) {
  const arr = props.movies;
  return (
    <ul>
      {arr
        .sort((a: any, b: any) => b.rank - a.rank)
        .map((value: any, idx: number) => (
          <li key={idx} color="black">
            <span>{value.name}</span>
            <span> - </span>
            <span>{value.rank}</span>
          </li>
        ))}
    </ul>
  );
}

const Leaderboard: any = () => {
  const [movies, isFetching] = LeaderboardApi();
  return (
    <React.Fragment>
      {isFetching ? "Loading..." : <MovieList movies={movies} />}
    </React.Fragment>
  );
};

export default Leaderboard;
