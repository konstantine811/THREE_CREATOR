export interface IMeshPosition {
  x: number;
  y: number;
  z: number;
}

export interface ICubeGeometry {
  width?: number | undefined;
  height?: number | undefined;
  depth?: number | undefined;
  widthSegments?: number | undefined;
  heightSegments?: number | undefined;
  depthSegments?: number | undefined;
}

export interface IObjectPhysicConfig {
  mass?: number;
  collisionFlags?: number;
}
