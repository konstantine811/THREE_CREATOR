import Experience from '@app/core/three-worlds/common/Experience';
// world
import Environment from '@core/helpers/common/Environment';

export default class InitTemplate extends Experience {
  private environment!: Environment;

  constructor(canvas: HTMLCanvasElement) {
    super(canvas);

    this.subscription.add(
      this.time.onAnimationFrame$.subscribe(this.worldUpdate)
    );
    this.subscription.add(
      this.resources.texutreReady$.subscribe(() => {
        // setup environment

        this.environment = new Environment();
      })
    );
  }

  private worldUpdate = () => {};
}
