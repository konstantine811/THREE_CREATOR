// core
import { Observable } from 'rxjs';
// main class
import InstanceScene from '@core/three-worlds/common/InstanceScene';
// world
import Environment from '@core/helpers/common/Environment';
import Floor from './Floor';
import Fox from './Fox';
// source
import { SOURCE_PATH_DATA } from '@app/core/three-worlds/code-structuring/config/source.config';

export default class GamePersonInit extends InstanceScene {
  private environment!: Environment;
  private floor!: Floor;
  private fox!: Fox;
  private _countLoadResources = 0;
  private _loadedResourcesItems$: Observable<number>;

  get countLoadResources(): number {
    return this._countLoadResources;
  }

  get loadedResourcesItems$(): Observable<number> {
    return this._loadedResourcesItems$;
  }

  constructor(canvas: HTMLCanvasElement) {
    super(canvas, SOURCE_PATH_DATA);
    this._countLoadResources = this.resources.countLoadResources;
    this._loadedResourcesItems$ = this.resources.loaded$;
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
