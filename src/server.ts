import "dotenv-defaults/config";
import cors from "cors";
import errorHandler from "middleware-http-errors";
import express, { json, Request, Response } from "express";

const app = express();
app.use(json());
app.use(cors({
  // Only accept requests from
  origin: process.env.CLIENT_URL
}));

const stripe = require("stripe")(
  process.env.STRIPE_PRIVATE_KEY
);

// TODO type narrow other env variables
// Can't just use a .some/.every over a list of strings e.g. ["PORT", "HOST"] + in, see:
//  https://github.com/microsoft/TypeScript/issues/43284
if (process.env.PORT === undefined || process.env.IP === undefined) {
  // Should never happen due to dotenv-defaults. Plausible for stripe keys though
  throw "Environment variable(s) PORT or IP not set";
}
const PORT: number = parseInt(process.env.PORT);
const HOST: string = process.env.IP;

app.post('/v1/merch/checkout_sessions.js', (req: Request, res: Response) => {
  //! TODO - param is return_url
  const ret = merchCreateCheckoutSession(req.headers.origin as string);
  return res.json(ret);
});

app.get('/v1/merch/checkout_sessions.js', (req: Request, res: Response) => {
  const ret = merchRetrieveCheckoutSession(req.query.session_id as string);
  return res.json(ret);
});

app.use(errorHandler());
app.listen(PORT, HOST, () => {
  console.log(`Server started on port ${PORT} at ${HOST}`);
});
