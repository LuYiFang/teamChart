const env = process.env.REACT_APP_ENV;

const appRoot = process.env.REACT_APP_API_ROOT;
export const webSocketRoot = process.env.REACT_APP_WEB_SOCKET_ROOT as string;

export const api = {
  env: env,
  users: appRoot + "/users",
  login: appRoot + "/login",
  signup: appRoot + "/signup",
};
