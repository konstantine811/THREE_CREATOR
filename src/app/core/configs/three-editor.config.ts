import { IThreeGeometryGonfig } from '../models/three-editor.model';

export enum ThreeGeometry {
  cube = 'cube',
  sphere = 'sphere',
  torus = 'torus',
}

export const THREE_GEOMETRY_TYPES: IThreeGeometryGonfig[] = [
  {
    geometryName: ThreeGeometry.cube,
    count: 100,
    selectedMaterialIndex: 1,
  },
  {
    geometryName: ThreeGeometry.sphere,
    count: 100,
    selectedMaterialIndex: 1,
  },
  {
    geometryName: ThreeGeometry.torus,
    count: 100,
    selectedMaterialIndex: 1,
  },
];
