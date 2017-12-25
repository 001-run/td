// @flow
import { SIZE } from "./const";
import { intersects } from "./utils";

let entities = {};

let Entity = function(id: ?number) {
  this.id = id || Entity.prototype._id++;
  if (entities.hasOwnProperty(this.id)) {
    throw Error(`id ${this.id} is already in use`);
  }
  entities[this.id] = this;

  this.components = {};
};
Entity.prototype._id = 0;

Entity.prototype.addComponent = function(component) {
  this.components[component.name] = component;
  return this;
};

Entity.prototype.hasComponent = function(componentName) {
  if (typeof componentName === "function") {
    return !!this.components[componentName.prototype.name];
  } else {
    return !!this.components[componentName];
  }
};

Entity.prototype.removeComponent = function(componentName) {
  if (typeof componentName === "function") {
    delete this.components[componentName.prototype.name];
  } else {
    delete this.components[componentName];
  }

  return this;
};

Entity.prototype.print = function() {
  console.log(JSON.stringify(this, null, 4));
};

let Components = {};

Components.Transform = function(
  params: ?{ x?: number, y?: number }
): { x: number, y: number } {
  params = params || { x: 0, y: 0 };
  this.x = params.x;
  this.y = params.y;

  return this;
};
Components.Transform.prototype.name = "transform";

Components.Render = function(): {} {
  //TODO add support for sprites

  return this;
};
Components.Render.prototype.name = "render";

Components.MouseControl = function() {
  return this;
};
Components.MouseControl.prototype.name = "mouseControl";

Components.Collide = function(
  params: ?{ collide?: boolean }
): { collide: boolean } {
  params = params || { collide: false };
  this.collide = params.collide;

  return this;
};
Components.Collide.prototype.name = "collide";

let RenderSystem = function(canvas: HTMLCanvasElement) {
  this.canvas = canvas;
  this.ctx = canvas.getContext("2d");
};

console.log(SIZE);
//TODO build entity query system instead of passing all entities to each system
RenderSystem.prototype.update = function(entities: any) {
  // clear screen
  this.ctx.save();
  this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.ctx.restore();

  this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);

  for (let entity: any of Object.values(entities)) {
    if (
      entity.hasComponent(Components.Transform) &&
      entity.hasComponent(Components.Render)
    ) {
      this.ctx.fillRect(
        entity.components.transform.x,
        entity.components.transform.y,
        SIZE,
        SIZE
      );
    }
  }
};

let MouseControlSystem = function(canvas: HTMLCanvasElement) {
  this.inputData = { x: 0, y: 0 };

  canvas.addEventListener(
    "mousemove",
    (evt: MouseEvent) => {
      let rect = canvas.getBoundingClientRect();

      this.inputData.x = evt.clientX - rect.left;
      this.inputData.y = evt.clientY - rect.top;
    },
    false
  );
};

//TODO build entity query system instead of passing all entities to each system
MouseControlSystem.prototype.update = function(entities: any) {
  for (let entity: any of Object.values(entities)) {
    if (entity.hasComponent(Components.MouseControl)) {
      entity.components.transform.x = this.inputData.x;
      entity.components.transform.y = this.inputData.y;
    }
  }
};

let CollisionSystem = function() {};

//TODO build entity query system instead of passing all entities to each system
CollisionSystem.prototype.update = function(entities: any) {
  for (let i = 0; i < Object.keys(entities).length; i++) {
    for (let j = i + 1; j < Object.keys(entities).length; j++) {
      const entityA = entities[i];
      const entityB = entities[j];

      if (
        !entityA.hasComponent(Components.MouseControl) &&
        !entityB.hasComponent(Components.MouseControl)
      )
        continue;

      if (
        intersects(entityA.components.transform, entityB.components.transform)
      ) {
        console.log(`entity ${entityA.id} intersects with ${entityB.id}`);
      }
    }
  }
};

const ECS = {
  Entity,
  entities,

  Components,

  Systems: {
    RenderSystem,
    MouseControlSystem,
    CollisionSystem
  }
};

export default ECS;
