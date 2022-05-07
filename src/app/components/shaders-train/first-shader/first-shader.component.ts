import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
// three scene
import ShaderWorld from '@core/three-worlds/shader-lesson/first/ShaderWorld';

@Component({
  selector: 'app-first-shader',
  templateUrl: './first-shader.component.html',
  styleUrls: ['./first-shader.component.scss'],
})
export class FirstShaderComponent implements OnInit, AfterViewInit {
  @ViewChild('webgl', { static: true }) private webglEl!: ElementRef;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const canvas = this.webglEl.nativeElement as HTMLCanvasElement;
    const shaderWorld = new ShaderWorld(canvas);
  }
}
