//libs
import * as dat from 'lil-gui';
import * as THREE from 'three';
// own
import Experience from '@app/core/three-worlds/common/Experience';
// world
import Environment from '@core/helpers/common/Environment';
// config
import { SOURCE_PATH_DATA } from '@app/core/three-worlds/PhysicWord/config/config';
// staff
import Floor from './world/Floor';
import Cube from './world/Cube';
// constraints
import Lock from './world/constraints/Lock';
import Fixed from './world/constraints/Fixed';
import PointToPoint from './world/constraints/PointToPoint';
import Hinge from './world/constraints/Hinge';

export default class PhysicsWorld extends Experience {
  private environment!: Environment;
  private debugFolder!: dat.GUI;
  private sizeFloor = 65;
  private floor!: Floor;
  private isFloorJump = false;

  constructor(canvas: HTMLCanvasElement) {
    super(canvas, SOURCE_PATH_DATA, true);
    this.camera.instance.position.set(
      28.58096865638889,
      15.897315499639731,
      30.534136635050324
    );
    this.camera.controls.update();
    this.subscription.add(
      this.time.onAnimationFrame$.subscribe((time) => {
        this.worldUpdate(time.elapsedTime);
      })
    );
    this.subscription.add(
      this.resources.texutreReady$.subscribe(() => {
        this.floor = new Floor(this.sizeFloor);
        if (this.debug.active) {
          this.debugFolder = this.debug.ui.addFolder('add Objects');
          this.debugFolder.add(this, 'addCube').name('add Cube');
          this.debug.ui
            .add(this, 'isFloorJump')
            .name('Is Floor jumping')
            .setValue(false);
          // axis helper
          const axesHelper = new THREE.AxesHelper(35);
          this.scene.add(axesHelper);
        } else {
          const cube = new Cube({});
        }
        // constraints train
        const lock = new Lock();
        const fixed = new Fixed();
        const pointToPoint = new PointToPoint();
        const hinge = new Hinge();
        // setup environment
        this.environment = new Environment();
      })
    );
  }

  addCube = () => {
    const count = 100;
    for (let i = 0; i < count; i++) {
      const cube = new Cube({ floorSize: this.sizeFloor / 2 });
    }
  };

  private worldUpdate = (elapsedTime: number) => {
    if (this.floor && this.isFloorJump) {
      this.floor.floorPhysicObject.position.y = Math.sin(elapsedTime * 10);
      if (this.floor.floorPhysicObject.body) {
        this.floor.floorPhysicObject.body.needUpdate = true;
      }
    }
  };
}
