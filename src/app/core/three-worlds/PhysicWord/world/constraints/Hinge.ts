// main
import Experience from '@app/core/three-worlds/common/Experience';
// libs
import { AmmoPhysics } from '@enable3d/ammo-physics';
// object
import Cube from '@core/three-worlds/PhysicWord/world/Cube';

export default class Hinge {
  private experience: Experience;
  private physics: AmmoPhysics;
  constructor() {
    this.experience = Experience.getInstance();
    this.physics = this.experience.physics;

    this.createPhysicObject();
  }

  private createPhysicObject() {
    const cube1 = new Cube({
      size: { width: 1, height: 1, depth: 0.2 },
      position: { x: 12, y: 9, z: 0 },
      physicConfig: {
        mass: 0,
      },
    }).cubePhysicObject;
    const cube2 = new Cube({
      position: { x: 12, y: 7, z: 0 },
      size: { width: 1, height: 1, depth: 0.2 },
      physicConfig: {
        mass: 10,
      },
    }).cubePhysicObject;
    const cube3 = new Cube({
      position: { x: 12, y: 5, z: 0 },
      size: { width: 1, height: 1, depth: 0.2 },
      physicConfig: {
        mass: 10,
      },
    }).cubePhysicObject;
    this.physics.add.constraints.hinge(cube1.body, cube2.body, {
      pivotA: { y: -0.65 },
      pivotB: { y: 0.65 },
      axisA: { x: 1 },
      axisB: { x: 1 },
    });
    this.physics.add.constraints.hinge(cube2.body, cube3.body, {
      pivotA: { y: -0.65 },
      pivotB: { y: 0.65 },
      axisA: { x: 1 },
      axisB: { x: 1 },
    });
    cube3.body.setVelocityZ(1);
  }
}
