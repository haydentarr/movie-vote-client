// Check token and refresh before call to API
import { useMemo, useContext, useState, SetStateAction, Dispatch } from "react";
import authContext from "../auth/context";
import { handleRefresh } from "../auth/actions";
import BASE_URL from "../utils/config";

export const LeaderboardApi = (): [object[], boolean] => {
  const [state, dispatch]: any = useContext(authContext); // Needs a typescript type

  // Might be better as a reducer
  const [isFetching, setFetching] = useState(true);
  const [data, setData] = useState();
  // Not DRY, if another api was implemented refresh snippet
  // will need to be copied and pasted
  useMemo(() => {
    if (state.user.expires < Date.now() / 1000) {
      // Refreshing a token changes state, so this needs to be returned or..
      // Rank and fetch movies will fail auth
      // Then run again which will work.
      const refreshToken = async () => {
        await handleRefresh(dispatch);
      };
      refreshToken();
      return;
    }
    if (state.user.accessToken) fetchList(state, setFetching, setData);
  }, [state, dispatch]);

  return [data, isFetching];
};

// Not DRY fetching the same way three times with only the url that is different
const fetchList = async (
  state: any,
  setFetching: Dispatch<SetStateAction<boolean>>,
  setData: Dispatch<SetStateAction<object[]>>,
) => {
  try {
    setFetching(true);
    const response = await fetch(`${BASE_URL}/matching/list`, {
      headers: {
        Authorization: `Bearer ${state.user.accessToken}`,
      },
    });
    const result = await response.json();
    setData(result);
    setFetching(false);
  } catch (err) {
    setFetching(false);
  }
};
