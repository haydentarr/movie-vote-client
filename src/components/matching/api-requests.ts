// Check token and refresh before call to API
import {
  useEffect,
  useContext,
  useState,
  SetStateAction,
  Dispatch,
} from "react";
import authContext from "../auth/context";
import { checkAuthentication } from "../auth/actions";
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
    // NEEDS MIDDLEWARE TO CHECK AUTH STATE
    // IF FETCHING EITHER REFRESH OR LOGIN STOP
    if (state.isFetching) return; // If fetching auth return
    if (!state.isAuthenticated && state.errorMessage) {
      // If error message is present, user failed authentication - restart guest session
      setRank(null);
      return;
    }

    if (
      state.user.expires - Date.now() / 1000 < 2 &&
      state.user.expires !== 0 &&
      !state.errorMessage
    ) {
      // It's not currently refreshing and its about to expire refresh token
      // Refreshing a token changes state, so this needs to be returned or..
      // Rank and fetch movies will fail auth
      // Then run again which will work.
      const refreshToken = async () => {
        await checkAuthentication(dispatch);
      };
      refreshToken();
      return;
    }

    if (state.user.accessToken) {
      console.log("fetch movie");

      fetchMovie(state.user.accessToken, setFetching, setData);
    }
    if (newRank !== null) {
      console.log("rank movie");
      rankMovie(state.user.accessToken, setFetching, newRank);
    }
  }, [
    state.user.accessToken,
    state.user.expires,
    state.isFetching,
    state.isAuthenticated,
    state.errorMessage,
    dispatch,
    newRank,
  ]);

  return [data, isFetching, setRank, state.errorMessage];
};

const fetchMovie = async (
  accessToken: string,
  setFetching: Dispatch<SetStateAction<boolean>>,
  setData: Dispatch<SetStateAction<any>>,
) => {
  try {
    setFetching(true);
    const response = await fetch(`${BASE_URL}/matching`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
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
  accessToken: string,
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
        Authorization: `Bearer ${accessToken}`,
      },
    });
    setFetching(false);
    return;
  } catch (err) {
    setFetching(false);
  }
};
