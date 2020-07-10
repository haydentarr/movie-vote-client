export interface IAuth {
  isFetching: boolean;
  isAuthenticated: boolean;
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
  SUCCESS = "LOGIN_SUCCESS",
  ERROR = "LOGIN_ERROR",
  LOGOUT = "LOGIN_LOGOUT",
}
