import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
// three world
import ShaderPattern from '@core/three-worlds/shader-lesson/shader-pattern/ShaderPattern';

@Component({
  selector: 'app-shader-pattern',
  templateUrl: './shader-pattern.component.html',
  styleUrls: ['./shader-pattern.component.scss'],
})
export class ShaderPatternComponent implements OnInit {
  @ViewChild('webgl', { static: true }) private webglEl!: ElementRef;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const canvas = this.webglEl.nativeElement as HTMLCanvasElement;
    const shaderPattern = new ShaderPattern(canvas);
  }
}
