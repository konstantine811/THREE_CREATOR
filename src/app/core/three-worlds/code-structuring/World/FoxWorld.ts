// main class
import Experience from '../../common/Experience';
// world
import Environment from '../../../helpers/common/Environment';
import Floor from './Floor';
import Fox from './Fox';
// source
import { SOURCE_PATH_DATA } from '@app/core/three-worlds/code-structuring/config/source.config';

export default class FoxWorld extends Experience {
  private environment!: Environment;
  private floor!: Floor;
  private fox!: Fox;

  constructor(canvas: HTMLCanvasElement) {
    super(canvas, SOURCE_PATH_DATA);
    // Wait on resources laoded
    this.subscription.add(
      this.time.onAnimationFrame$.subscribe(this.worldUpdate)
    );
    this.subscription.add(
      this.resources.texutreReady$.subscribe(() => {
        // setup environment
        this.floor = new Floor();
        this.fox = new Fox();
        this.environment = new Environment();
      })
    );
  }

  private worldUpdate = () => {
    if (this.fox) {
      this.fox.update();
    }
  };
}
