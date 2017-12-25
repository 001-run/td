import "babel-polyfill";
import ECS from "./ecs";
window.ECS = ECS;

if (process.env.NODE_ENV !== "production") {
  console.log("DEV MODE");
}

const time = {
  start: null,
  now: null,
  delta: 0
};

const WIDTH = 1000;
const HEIGHT = 800;

const canvas = document.createElement("canvas");
canvas.width = WIDTH;
canvas.height = HEIGHT;
document.body.appendChild(canvas);

// make some game stuff
for (var i = 0; i < 20; i++) {
  const entity = new ECS.Entity();
  entity
    .addComponent(
      new ECS.Components.Transform({
        x: Math.floor(Math.random() * WIDTH),
        y: Math.floor(Math.random() * HEIGHT)
      })
    )
    .addComponent(new ECS.Components.Render());

  // first one is user controlled
  if (i === 0) {
    entity.addComponent(new ECS.Components.MouseControl());
  }
}

const systems = [
  new ECS.Systems.MouseControlSystem(canvas),
  new ECS.Systems.CollisionSystem(),
  new ECS.Systems.RenderSystem(canvas)
];

function loop(now) {
  if (!time.start) time.start = now;
  if (!time.now) time.now = now;

  time.delta = now - time.now;
  time.now = now;

  systems.map(system => system.update(ECS.entities));

  requestAnimationFrame(loop);
}

loop();
