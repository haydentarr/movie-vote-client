// Check token and refresh before call to API
import {
  useEffect,
  useContext,
  useState,
  SetStateAction,
  Dispatch,
} from "react";
import authContext from "../auth/context";
import { isAuthenticated } from "../auth/actions";
import BASE_URL from "../utils/config";

interface IRank {
  movieId: string;
  fighting: string;
}

export const MovieApi = (): [
  any,
  boolean,
  Dispatch<SetStateAction<IRank | null>>,
  any,
] => {
  const [state, dispatch]: any = useContext(authContext); // Needs a typescript type

  // Might be better as a reducer
  const [data, setData] = useState();
  const [isFetching, setFetching] = useState(true);
  const [newRank, setRank] = useState<IRank | null>(null);

  useEffect(() => {
    if (state.user.expires < Date.now() / 1000 && !state.errorMessage) {
      // Refreshing a token changes state, so this needs to be returned or..
      // Rank and fetch movies will fail auth
      // Then run again which will work.
      const refreshToken = async () => {
        await isAuthenticated(state, dispatch);
      };
      refreshToken();
      return;
    }
    console.log(state.errorMessage);

    if (state.user.accessToken) fetchMovie(state, setFetching, setData);
    if (newRank !== null) rankMovie(state, setFetching, newRank);
  }, [state, state.user.accessToken, state.errorMessage, dispatch, newRank]);

  return [data, isFetching, setRank, state.errorMessage];
};

const fetchMovie = async (
  state: any,
  setFetching: Dispatch<SetStateAction<boolean>>,
  setData: Dispatch<SetStateAction<any>>,
) => {
  try {
    setFetching(true);
    console.log(state);
    const response = await fetch(`${BASE_URL}/matching`, {
      headers: {
        Authorization: `Bearer ${state.user.accessToken}`,
      },
    });
    const result = await response.json();

    setData(Object.values(result));
    setFetching(false);
  } catch (err) {
    setFetching(false);
  }
};

const rankMovie = async (
  state: any,
  setFetching: Dispatch<SetStateAction<boolean>>,
  newRank: IRank,
) => {
  try {
    console.log(newRank);

    const rank = `${newRank.movieId},${newRank.fighting}`;
    setFetching(true);
    await fetch(`${BASE_URL}/matching?movies=${rank}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${state.user.accessToken}`,
      },
    });
    setFetching(false);
    return;
  } catch (err) {
    setFetching(false);
  }
};
