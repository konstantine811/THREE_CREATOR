import { ReplaySubject } from 'rxjs';

export default class Sizes {
  width = 0;
  height = 0;
  pixelRatio = 0;
  emitResize$: ReplaySubject<null> = new ReplaySubject(1);

  constructor() {
    // Setup
    this.updateSizes();
    window.addEventListener('resize', () => {
      this.updateSizes();
      this.emitResize$.next();
    });
  }

  private updateSizes(): void {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);
  }

  onDestroy() {
    window.removeEventListener('resize', this.updateSizes);
  }
}
