import client from "./client";

export const leaderboardApi = {
  list: (params) => client.get("/leaderboard", { params }).then((r) => r.data),
  me: () => client.get("/leaderboard/me").then((r) => r.data),
  badges: () => client.get("/leaderboard/badges").then((r) => r.data),
};
