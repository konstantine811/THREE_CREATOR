import Experience from '@app/core/three-worlds/common/Experience';
// world
import Environment from '@core/helpers/common/Environment';
import Plane from './Plane';
// shaders textures
import { SOURCE_PATH_DATA } from '../config/source.config';

export default class ShaderWorld extends Experience {
  private environment!: Environment;
  private plane!: Plane;

  constructor(canvas: HTMLCanvasElement) {
    super(canvas, SOURCE_PATH_DATA);

    this.subscription.add(
      this.time.onAnimationFrame$.subscribe((value) => {
        this.worldUpdate(value.elapsedTime);
      })
    );
    this.subscription.add(
      this.resources.texutreReady$.subscribe(() => {
        // setup environment
        this.plane = new Plane();
        this.environment = new Environment();
      })
    );
  }

  private worldUpdate = (elapsedTime: number) => {
    if (this.plane) {
      this.plane.materialUTime = elapsedTime;
    }
  };
}
