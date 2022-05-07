// main
import Experience from '@app/core/three-worlds/common/Experience';
// libs
import { AmmoPhysics } from '@enable3d/ammo-physics';
// object
import Cube from '@core/three-worlds/PhysicWord/world/Cube';

export default class PointToPoint {
  private experience: Experience;
  private physics: AmmoPhysics;
  constructor() {
    this.experience = Experience.getInstance();
    this.physics = this.experience.physics;

    this.createPhysicObject();
  }

  private createPhysicObject() {
    const cube1 = new Cube({
      size: { width: 1, height: 1, depth: 1 },
      position: { x: 8, y: 9, z: 0 },
      physicConfig: {
        mass: 0,
      },
    }).cubePhysicObject;
    const cube2 = new Cube({
      position: { x: 8, y: 7, z: 0 },
      size: { width: 1, height: 1, depth: 1 },
      physicConfig: {
        mass: 10,
      },
    }).cubePhysicObject;
    this.physics.add.constraints.pointToPoint(cube1.body, cube2.body, {
      pivotA: { z: 1.5, x: 0 },
      pivotB: { x: 0.2 },
    });
  }
}
