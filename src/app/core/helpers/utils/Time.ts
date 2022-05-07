import { ReplaySubject } from 'rxjs';
// libs
import * as THREE from 'three';
// models;
import { ITimeEmmitData } from '@app/core/models/three-editor.model';

export default class Time {
  start: number;
  current: number;
  elapsed = 0;
  delta = 16;
  onAnimationFrame$: ReplaySubject<ITimeEmmitData> = new ReplaySubject(1);
  private readonly clock = new THREE.Clock();

  constructor() {
    // Setup
    this.start = Date.now();
    this.current = this.start;
    this.elapsed = 0;
    this.delta = 16;

    this.tick();
  }

  private tick() {
    const currentTime = Date.now();
    this.delta = currentTime - this.current;
    this.current = currentTime;
    this.elapsed = this.current - this.start;
    const delta = this.clock.getDelta();
    this.clock.getDelta();
    this.onAnimationFrame$.next({
      elapsedTime: this.clock.getElapsedTime(),
      deltaTime: delta,
    });
    window.requestAnimationFrame(() => {
      this.tick();
    });
  }
}
