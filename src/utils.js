// @flow
import { SIZE } from "./const";

export const sqrt = Math.sqrt;

export function intersects(
  transformA: { x: number, y: number },
  transformB: { x: number, y: number }
): boolean {
  return (
    transformA.x < transformB.x + SIZE &&
    transformA.x + SIZE > transformB.x &&
    transformA.y < transformB.y + SIZE &&
    transformA.y + SIZE > transformB.y
  );
}
