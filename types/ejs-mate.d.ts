declare module "ejs-mate" {
  import { RequestHandler } from "express";

  interface Options {
    // Define any specific options if known
  }

  function ejsMate(options?: Options): RequestHandler;

  export = ejsMate;
}
