import React from "react";
import { Button, CardBg } from "./style";
import { MovieApi } from "./api-requests";

const Card: any = () => {
  const [movie, isFetching, setWinner, hasError] = MovieApi();

  if (hasError) return `${hasError.payload}`;
  if (isFetching) return "Loading...";

  return (
    <React.Fragment>
      {movie
        .filter((_i: object, index: number) => index < 2)
        .map((movie: any, idx: number) => (
          <CardBg key={idx}>
            <ul>
              <li>{movie.name}</li>
              <li>{movie.year}</li>
              <li>{movie.rottentomatoes}</li>
              <li>{movie.metacritic}</li>
              <li>{movie.image}</li>
              <Button
                onClick={async _e => {
                  await setWinner({
                    movieId: movie.id,
                    fighting: movie.fighting,
                  });
                }}
              >
                Pick
              </Button>
            </ul>
          </CardBg>
        ))}
    </React.Fragment>
  );
};

export default Card;
