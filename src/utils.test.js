import test from "ava";
import * as utils from "./utils";

test("utils works", t => {
  t.is(utils.square(2), 4);
});
