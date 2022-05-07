import { ThreeGeometry } from '../configs/three-editor.config';

export interface IThreeGeometryGonfig {
  geometryName: ThreeGeometry;
  count: number;
  selectedMaterialIndex: number;
}

export interface IThreeEditGeometryEvent {
  geometryName: ThreeGeometry;
  count: number;
}

export interface IThreeEditMaterialEvent {
  geometryName: ThreeGeometry;
  path: string;
}

export interface IWindowSizes {
  width: number;
  height: number;
}

export interface ITimeEmmitData {
  elapsedTime: number;
  deltaTime: number;
}
