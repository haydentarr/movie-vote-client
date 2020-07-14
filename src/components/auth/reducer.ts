import { IAuth, LOGIN } from "./types";

export const initialState: IAuth = {
  isFetching: false,
  isAuthenticated: false,
  isRefreshing: false,
  user: {
    role: "guest",
    expires: 0,
  },
};

export const userAuth = (state = initialState, action: any) => {
  switch (action.type) {
    case LOGIN.REQUEST:
      return {
        ...state,
        isFetching: true,
        isAuthenticated: false,
        isRefreshing: false,
        errorMessage: null,
      };

    case LOGIN.SUCCESS:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        isRefreshing: false,
        user: { ...action.user },
      };

    case LOGIN.ERROR:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        isRefreshing: false,
        errorMessage: action,
      };

    case LOGIN.REFRESHING:
      return {
        ...state,
        isFetching: true,
        isAuthenticated: true,
        isRefreshing: true,
        errorMessage: null,
      };

    case LOGIN.LOGOUT:
      return {
        ...state,
        isFetching: true,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};
