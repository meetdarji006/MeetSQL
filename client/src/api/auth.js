import client from "./client";

export const authApi = {
  signup: (data) => client.post("/auth/signup", data).then((r) => r.data),
  login: (data) => client.post("/auth/login", data).then((r) => r.data),
  refresh: (data) => client.post("/auth/refresh", data).then((r) => r.data),
  logout: (data) => client.post("/auth/logout", data).then((r) => r.data),
  profile: () => client.get("/auth/profile").then((r) => r.data),
};
