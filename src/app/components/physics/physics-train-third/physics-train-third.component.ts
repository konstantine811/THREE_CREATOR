import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
// libs
import { PhysicsLoader } from '@enable3d/common/dist/physicsLoader';
// physics world
import PhysicsWorld from '@app/core/three-worlds/PhysicWord/PhysicsWorld';
@Component({
  selector: 'app-physics-train-third',
  templateUrl: './physics-train-third.component.html',
  styleUrls: ['./physics-train-third.component.scss'],
})
export class PhysicsTrainThirdComponent implements OnInit {
  @ViewChild('webgl', { static: true }) private webglEl!: ElementRef;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const canvas = this.webglEl.nativeElement as HTMLCanvasElement;

    PhysicsLoader(
      './assets/ammo.js-main/builds',
      () => new PhysicsWorld(canvas)
    );
  }
}
