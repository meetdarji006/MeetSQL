import client from "./client";

export const submissionsApi = {
  list: (params) => client.get("/submissions", { params }).then((r) => r.data),
  get: (id) => client.get(`/submissions/${id}`).then((r) => r.data),
  byProblem: (problemId) => client.get(`/submissions/problem/${problemId}`).then((r) => r.data),
};
