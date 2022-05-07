// main
import Experience from '@app/core/three-worlds/common/Experience';
// libs
import { AmmoPhysics } from '@enable3d/ammo-physics';
// object
import Cube from '@core/three-worlds/PhysicWord/world/Cube';

export default class Fixed {
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
      position: { x: 4, y: 9, z: 0 },
      physicConfig: {
        mass: 10,
      },
    }).cubePhysicObject;
    const cube2 = new Cube({
      position: { x: 4, y: 7, z: 0 },
      size: { width: 1, height: 1, depth: 1 },
      physicConfig: {
        mass: 90,
      },
    }).cubePhysicObject;
    this.physics.add.constraints.lock(cube1.body, cube2.body);
    cube2.body.setVelocityY(-10);
  }
}
