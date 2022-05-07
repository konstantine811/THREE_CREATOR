// main
import Experience from '@app/core/three-worlds/common/Experience';
// libs
import { AmmoPhysics } from '@enable3d/ammo-physics';
// object
import Cube from '@core/three-worlds/PhysicWord/world/Cube';

export default class Lock {
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
      position: { x: 0, y: 4, z: 0 },
      physicConfig: {
        mass: 500,
      },
    }).cubePhysicObject;
    const cube2 = new Cube({
      position: { x: 0, y: 2, z: 0 },
      size: { width: 1, height: 1, depth: 1 },
      physicConfig: {
        mass: 100,
      },
    }).cubePhysicObject;
    this.physics.add.constraints.lock(cube1.body, cube2.body);
  }
}
