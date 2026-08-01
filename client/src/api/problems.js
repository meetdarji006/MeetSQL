import client from "./client";

export const problemsApi = {
  list: (params) => client.get("/problems", { params }).then((r) => r.data),
  get: (slug) => client.get(`/problems/${slug}`).then((r) => r.data),
  topics: () => client.get("/problems/topics").then((r) => r.data),
  solvedIds: () => client.get("/problems/solved-ids").then((r) => r.data),
};
