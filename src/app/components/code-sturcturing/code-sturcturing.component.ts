import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
// helpers
import FoxWorld from '@app/core/three-worlds/code-structuring/World/FoxWorld';

@Component({
  selector: 'app-code-sturcturing',
  templateUrl: './code-sturcturing.component.html',
  styleUrls: ['./code-sturcturing.component.scss'],
})
export class CodeSturcturingComponent implements OnInit, AfterViewInit {
  @ViewChild('webgl', { static: true }) private webglEl!: ElementRef;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const canvas = this.webglEl.nativeElement as HTMLCanvasElement;
    const foxWorld = new FoxWorld(canvas);
  }
}
