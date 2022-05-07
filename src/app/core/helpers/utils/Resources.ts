import { Observable, Subject } from 'rxjs';
// loaders
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';
// model
import {
  ResourceItems,
  SourcePathData,
} from '@app/core/models/helpers-code-structuring/source.model';
import { LoaderName } from '@app/core/configs/source-loader.config';

export default class Resources {
  private source: SourcePathData[];
  private loaders!: {
    [LoaderName.gltf]: GLTFLoader;
    [LoaderName.texture]: THREE.TextureLoader;
    [LoaderName.cubeTexture]: THREE.CubeTextureLoader;
  };
  private toLoad = 0;
  private loaded = 0;
  private _loaded$: Subject<number> = new Subject();
  private _texutreReady$: Subject<null> = new Subject();
  private items: ResourceItems = {} as any;

  constructor(source: SourcePathData[]) {
    this.source = source;

    this.toLoad = this.source.length;

    this.setLoaders();
    this.startLoading();
  }

  get texutreReady$(): Observable<null> {
    return this._texutreReady$;
  }

  get resourceItems(): ResourceItems {
    return this.items;
  }

  get countLoadResources(): number {
    return this.toLoad;
  }

  get loaded$(): Observable<number> {
    return this._loaded$;
  }

  setLoaders(): void {
    this.loaders = {
      [LoaderName.gltf]: new GLTFLoader(),
      [LoaderName.texture]: new THREE.TextureLoader(),
      [LoaderName.cubeTexture]: new THREE.CubeTextureLoader(),
    };
  }

  startLoading() {
    this.source.forEach((source) => {
      if (source.type === LoaderName.cubeTexture) {
        if (!source.getPath) {
          return;
        }
        this.loaders[source.type].load(
          source.getPath() as string & string[],
          (file) => {
            this.sourceLoaded(source, file);
          }
        );
      } else if (source.type === LoaderName.texture) {
        (this.loaders[source.type] as THREE.TextureLoader).load(
          source.path as string,
          (file) => {
            this.sourceLoaded(source, file);
          }
        );
      } else if (source.type === LoaderName.gltf) {
        (this.loaders[source.type] as GLTFLoader).load(
          source.path as string,
          (file) => {
            this.sourceLoaded(source, file);
          }
        );
      }
    });
  }

  private sourceLoaded(
    source: SourcePathData,
    file: THREE.CubeTexture | GLTF | THREE.Texture
  ) {
    this.items[source.name as string] = file;
    this.loaded++;
    this._loaded$.next(this.loaded);
    if (this.loaded === this.toLoad) {
      this._texutreReady$.next();
    }
  }
}
