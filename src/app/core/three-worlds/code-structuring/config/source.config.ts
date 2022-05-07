import { LoaderName } from '@app/core/configs/source-loader.config';
import { SourcePathData } from '../../../models/helpers-code-structuring/source.model';

export enum SourceName {
  environmentMapTexture = 'environmentMapTexture',
  grassColorTexture = 'grassColorTexture',
  grassNormalTexture = 'grassNormalTexture',
  foxModel = 'foxModel',
}

export const SOURCE_PATH_DATA: SourcePathData[] = [
  {
    name: SourceName.environmentMapTexture,
    type: LoaderName.cubeTexture,
    staticPath: '/assets/textures/environmentMaps/0',
    path: ['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'],
    getPath() {
      if (Array.isArray(this.path)) {
        return this.path.map((path) => `${`${this.staticPath}/${path}`}`);
      } else {
        return `${`${this.staticPath}/${this.path}`}`;
      }
    },
  },
  {
    name: SourceName.grassColorTexture,
    type: LoaderName.texture,
    path: '/assets/textures/dirt/color.jpg',
  },
  {
    name: SourceName.grassNormalTexture,
    type: LoaderName.texture,
    path: '/assets/textures/dirt/normal.jpg',
  },
  {
    name: SourceName.foxModel,
    type: LoaderName.gltf,
    path: '/assets/models/Fox/glTF/Fox.gltf',
  },
];
