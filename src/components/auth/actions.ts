import { LOGIN } from "./types";
import jwt from "jsonwebtoken";
import BASE_URL from "../utils/config";

// import { BASE_UR } from "./routes.ts"

function requestLogin(creds?: { email: string; password: string }) {
  return {
    type: LOGIN.REQUEST,
    payload: creds,
  };
}

function receiveLogin(payload: any) {
  return {
    type: LOGIN.SUCCESS,
    accessToken: payload.accessToken,
    user: payload.user,
  };
}

const loginError = (payload: object) => {
  return {
    type: LOGIN.ERROR,
    payload,
  };
};

// ADD GUEST USER FUNCTION handleGuest()
export const handleGuest = async (dispatch: any) => {
  try {
    dispatch(requestLogin());
    const res = await fetch(`${BASE_URL}/auth/guest`, {
      method: "GET",
      credentials: "include",
    });
    // START TIMER FOR ACCESS TOKEN, EXPIRY SHOULD BE SENT WITH ACCESS TOKEN

    const json = await res.json();
    const decodedJwt: any = jwt.decode(json.accessToken);
    const user = {
      accessToken: json.accessToken,
      role: "guest",
      expires: decodedJwt.exp,
    };
    const payload = {
      accessToken: json.accessToken,
      user,
    };
    dispatch(receiveLogin(payload));
  } catch (err) {
    dispatch(loginError(err));
  }
};

export const handleRefresh = async (dispatch: any) => {
  try {
    dispatch(requestLogin());
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "GET",
      credentials: "include",
    });
    // START TIMER FOR ACCESS TOKEN, EXPIRY SHOULD BE SENT WITH ACCESS TOKEN

    const json = await res.json();
    const decodedJwt: any = jwt.decode(json.accessToken);
    const user = {
      accessToken: json.accessToken,
      role: "guest",
      expires: decodedJwt.exp,
    };
    const payload = {
      accessToken: json.accessToken,
      user,
    };

    dispatch(receiveLogin(payload));
  } catch (err) {
    dispatch(loginError(err));
  }
};

export const isAuthenticated = async (state: any, dispatch: any) => {
  try {
    const expired = state.user.expires < Date.now() / 1000;
    // Check to see if there are any errors as well to stop infinite loop
    if (expired && !state.errorMessage) {
      handleRefresh(dispatch);
      return false;
    }
    return true;
  } catch (err) {
    dispatch(loginError(err));
  }
};

// REWRITE ASYNC
export const handleLogin = (creds: any) => {
  let config = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `username=${creds.username}&password=${creds.password}`,
  };

  return async (dispatch: any) => {
    // We dispatch requestLogin to kickoff the call to the API
    dispatch(requestLogin(creds));

    return fetch(`${BASE_URL}/auth/login`, config)
      .then(response => response.json().then(user => ({ user, response })))
      .then(({ user, response }) => {
        if (!response.ok) {
          // If there was a problem, we want to
          // dispatch the error condition
          dispatch(loginError(user.message));
          return Promise.reject(user);
        } else {
          const decodedJwt = jwt.decode(user.accessToken);
          const payload = {
            user,
            decodedJwt,
          };

          // Dispatch the success action
          dispatch(receiveLogin(payload));
        }
      })
      .catch(err => dispatch(loginError(err)));
  };
};

export const handleLogout = () => {
  return {
    type: LOGIN.LOGOUT,
  };
};
