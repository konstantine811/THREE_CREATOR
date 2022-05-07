import Debug from '../utils/Debug';
// scene instance
import SceneBus from '@core/helpers/common/SceneBus';
// libs
import { AmmoPhysics } from '@enable3d/ammo-physics';

export default class Physics {
  private sceneBus: SceneBus;
  private scene: THREE.Scene;
  private debug: Debug;
  private isDebug = false;
  readonly physics: AmmoPhysics;

  constructor() {
    this.sceneBus = SceneBus.getSceneInstance();
    this.scene = this.sceneBus.scene;
    this.debug = this.sceneBus.debug;

    // physics
    this.physics = new AmmoPhysics(this.scene);
    if (this.debug.active) {
      this.physics.debug?.enable();
      this.debug.ui
        .add(this, 'isDebug')
        .onChange(() => {
          this.enableDebug();
        })
        .name('Debug Physics')
        .setValue(false);
    }
  }

  enableDebug() {
    if (this.isDebug) {
      this.physics.debug?.enable();
    } else {
      this.physics.debug?.disable();
    }
  }
}
