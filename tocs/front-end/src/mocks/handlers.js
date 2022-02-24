import { rest } from "msw";

export const handlers = [
  rest.post("http://localhost:3001/signin", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        userId: 1,
        username: "fakeUsername",
        roles: ["fakeRole"],
        accessToken: "fakeAccessToken",
      })
    );
  }),
];
