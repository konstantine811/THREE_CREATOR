import { LoaderName } from '@app/core/configs/source-loader.config';
// gltf
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
// helper classes
import Camera from '@app/core/helpers/renderer/Camera';
import Debug from '@app/core/helpers/utils/Debug';
import Resources from '@app/core/helpers/utils/Resources';
import Renderer from '@app/core/helpers/renderer/Renderer';
import Time from '@app/core/helpers/utils/Time';
import Sizes from '@app/core/helpers/utils/Sizes';

export interface SourcePathData {
  name: string;
  type: LoaderName;
  staticPath?: string;
  path: string[] | string;
  getPath?(): string[] | string;
}

export interface ResourceItems {
  [key: string]: THREE.CubeTexture | GLTF | THREE.Texture;
}
