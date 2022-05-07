// helper classes
import Debug from '@core/helpers/utils/Debug';
import Resources from '../utils/Resources';
import Renderer from '../renderer/Renderer';
import Camera from '../renderer/Camera';
import Time from '../utils/Time';
import Sizes from '../utils/Sizes';

let sceneBus: SceneBus;

export default class SceneBus {
  canvas!: HTMLCanvasElement;
  scene!: THREE.Scene;
  debug!: Debug;
  resources!: Resources;
  camera!: Camera;
  renderer!: Renderer;
  time!: Time;
  sizes!: Sizes;

  constructor() {
    sceneBus = this;
  }

  static getSceneInstance(): SceneBus {
    return sceneBus;
  }
}
