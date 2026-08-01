import client from "./client";

export const judgeApi = {
  submit: (data) => client.post("/judge/submit", data).then((r) => r.data),
  run: (data) => client.post("/judge/run", data).then((r) => r.data),
};
