import { LoaderName } from '@app/core/configs/source-loader.config';
import { SourcePathData } from '../../../models/helpers-code-structuring/source.model';

export enum SourceName {
  environmentMapTexture = 'environmentMapTexture',
  flag = 'flag',
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
    name: SourceName.flag,
    type: LoaderName.texture,
    path: '/assets/textures/images/flag_ukraine.png',
  },
];
