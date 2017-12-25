import test from "ava";
import * as utils from "./utils";
import { SIZE } from "./const";

test("intersection works", t => {
  const a = { x: 0, y: 0 };
  const b = { x: 10, y: 10 };
  const c = { x: a.x + SIZE, y: a.y + SIZE };

  t.is(utils.intersects(a, b), true);
  t.is(utils.intersects(a, c), false);
});
