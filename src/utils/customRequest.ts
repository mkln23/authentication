import type { Request } from "express";
import type { ParamsDictionary } from "express-serve-static-core";

export interface CustomRequest<
  Q extends ParamsDictionary = {},
  P extends ParamsDictionary = {},
  B = {},
> extends Request {
  query: Q;
  body: B;
  params: P;
}
