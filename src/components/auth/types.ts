export interface IAuth {
  isFetching: boolean;
  isAuthenticated: boolean;
  isRefreshing: boolean;
  user: {
    role: string;
    accessToken?: string;
    expires: number;
    name?: string;
    email?: string;
  };
  errorMessage?: string;
}

export enum LOGIN {
  REQUEST = "LOGIN_REQUEST",
  REFRESHING = "LOGIN_REFRESHING",
  SUCCESS = "LOGIN_SUCCESS",
  ERROR = "LOGIN_ERROR",
  LOGOUT = "LOGIN_LOGOUT",
}
