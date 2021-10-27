// Check token and refresh before call to API
import {
  useContext,
  useState,
  SetStateAction,
  Dispatch,
  useEffect,
} from "react";
import authContext from "../auth/context";
import { checkAuthentication } from "../auth/actions";
import BASE_URL from "../utils/config";

export const LeaderboardApi = (): [any, boolean] => {
  const [state, dispatch]: any = useContext(authContext); // Needs a typescript type

  // Might be better as a reducer
  const [isFetching, setFetching] = useState(true);
  const [data, setData] = useState();
  // Not DRY, if another api was implemented refresh snippet
  // will need to be copied and pasted
  useEffect(() => {
    if (state.isFetching) return; // If fetching auth return
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
    if (state.user.accessToken)
      fetchList(state.user.accessToken, setFetching, setData);
  }, [
    state.user.accessToken,
    state.user.expires,
    state.isFetching,
    state.errorMessage,
    dispatch,
  ]);

  return [data, isFetching];
};

// Not DRY fetching the same way three times with only the url that is different
const fetchList = async (
  accessToken: string,
  setFetching: Dispatch<SetStateAction<boolean>>,
  setData: Dispatch<SetStateAction<any>>
) => {
  try {
    setFetching(true);
    console.log(accessToken);
    const response = await fetch(`${BASE_URL}/matching/list`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const result = await response.json();
    console.log(Object.values(result));
    setData(Object.values(result));
    setFetching(false);
  } catch (err) {
    setFetching(false);
  }
};
