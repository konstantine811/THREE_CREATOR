import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// config
import {
  THREE_GEOMETRY_TYPES,
  ThreeGeometry,
} from '@app/core/configs/three-editor.config';
import {
  IThreeEditGeometryEvent,
  IThreeEditMaterialEvent,
} from '@app/core/models/three-editor.model';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
})
export class SideBarComponent implements OnInit {
  @Output() typedText: EventEmitter<string> = new EventEmitter();
  @Output() typedTexture: EventEmitter<string> = new EventEmitter();
  @Output() addGeometry: EventEmitter<IThreeEditGeometryEvent> =
    new EventEmitter();
  @Output() removeGeometry: EventEmitter<IThreeEditGeometryEvent> =
    new EventEmitter();
  @Output() geometryTexture: EventEmitter<IThreeEditMaterialEvent> =
    new EventEmitter();
  @Output() changeRangeVal: EventEmitter<number> = new EventEmitter();
  @Output() isAnimation: EventEmitter<boolean> = new EventEmitter();
  @Output() saveFrame: EventEmitter<null> = new EventEmitter();
  @Input() rangeVal = 0;
  @Input() isAnim = false;
  isHide = true;
  matcapImg = [1, 2, 3, 4, 5, 6, 7, 8];
  selectedIndex = 1;
  readonly threeGeometry = THREE_GEOMETRY_TYPES;

  constructor() {}

  onKey(event: KeyboardEvent) {
    const value = (event.target as HTMLInputElement).value;
    this.typedText.emit(value);
  }

  getPath(index: number) {
    return `assets/textures/matcaps/${index}.png`;
  }

  onTextureSelected(index: number) {
    this.selectedIndex = index;
    this.typedTexture.emit(`/matcaps/${index}.png`);
  }

  geometryTextureSelected(
    geometry: ThreeGeometry,
    index: number,
    arrIndex: number
  ) {
    this.threeGeometry[arrIndex].selectedMaterialIndex = index;
    this.geometryTexture.emit({
      geometryName: geometry,
      path: `/matcaps/${index}.png`,
    });
  }

  onAddGeometry(type: ThreeGeometry, arrIndex: number) {
    const cubeCount = this.threeGeometry[arrIndex].count;
    this.addGeometry.emit({
      geometryName: type,
      count: cubeCount,
    });
  }

  onRemoveGeometry(type: ThreeGeometry, arrIndex: number) {
    const cubeCount = this.threeGeometry[arrIndex].count;
    this.removeGeometry.emit({
      geometryName: type,
      count: cubeCount,
    });
  }

  changeRange() {
    this.changeRangeVal.emit(this.rangeVal);
  }

  ngOnInit(): void {}
}
