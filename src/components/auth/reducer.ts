import { IAuth, LOGIN } from "./types";

export const initialState: IAuth = {
  isFetching: false,
  isAuthenticated: false,
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
      };

    case LOGIN.SUCCESS:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        user: { ...action.user },
      };

    case LOGIN.ERROR:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action,
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
