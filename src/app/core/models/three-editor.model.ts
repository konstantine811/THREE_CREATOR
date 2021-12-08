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
