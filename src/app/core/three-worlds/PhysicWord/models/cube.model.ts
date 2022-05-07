import {
  ICubeGeometry,
  IMeshPosition,
  IObjectPhysicConfig,
} from '@app/core/models/mesh.model';

export interface ICubeSetting {
  floorSize?: number;
  position?: IMeshPosition;
  size?: ICubeGeometry;
  physicConfig?: IObjectPhysicConfig;
}
