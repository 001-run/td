// @flow

import "babel-polyfill";
import { square } from "./utils";

if (process.env.NODE_ENV !== "production") {
  console.log("DEV MODE");
}

console.log(square(2));
