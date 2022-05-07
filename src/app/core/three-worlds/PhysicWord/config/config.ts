import { LoaderName } from '@core/configs/source-loader.config';
import { SourcePathData } from '@core/models/helpers-code-structuring/source.model';

export enum SourceName {
  environmentMapTexture = 'environmentMapTexture',
  grassColorTexture = 'grassColorTexture',
  grassNormalTexture = 'grassNormalTexture',
  cubeColorTexture = 'cubeColorTexture',
  cubeNormalTexture = 'cubeNormalTexture',
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
    name: SourceName.cubeColorTexture,
    type: LoaderName.texture,
    path: '/assets/textures/wood/box/TexturesCom_WoodPlanksBeamed0116_17_seamless_S.jpeg',
  },
  {
    name: SourceName.cubeNormalTexture,
    type: LoaderName.texture,
    path: '/assets/textures/wood/box/TexturesCom_WoodPlanksBeamed0116_20_M.jpeg',
  },
];
