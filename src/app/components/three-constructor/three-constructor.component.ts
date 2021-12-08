import {
  AfterViewInit,
  Component,
  HostBinding,
  HostListener,
} from '@angular/core';
// threejs
import * as THREE from 'three';
import {
  LinearFilter,
  LinearMipmapNearestFilter,
  Mesh,
  MirroredRepeatWrapping,
  NearestFilter,
  RepeatWrapping,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import stats from 'three/examples/jsm/libs/stats.module';
// config
import { Textures, TypeTextures } from './config';
// dat gui
import * as dat from 'dat.gui';

@Component({
  selector: 'app-three-constructor',
  templateUrl: './three-constructor.component.html',
  styleUrls: ['./three-constructor.component.scss'],
})
export class ThreeConstructorComponent implements AfterViewInit {
  private scene!: THREE.Scene;
  private renderer!: THREE.WebGLRenderer;
  private camera!: THREE.PerspectiveCamera;
  private cube!: THREE.Mesh;
  readonly ARC_SEGMENTS = 200;
  private texture!: THREE.Texture;
  private readonly pathToTexture = './assets/textures';
  private readonly clock = new THREE.Clock();
  private sphereMesh!: Mesh;
  private torusMesh!: Mesh;
  private cubeMesh!: Mesh;
  private planeMesh!: Mesh;
  private textures!: { [key in TypeTextures]: THREE.Texture };
  private gui!: dat.GUI;
  private environmentMapTexture!: THREE.CubeTexture;

  textureLoadMeneger(): { [key in TypeTextures]: THREE.Texture } {
    let textures: { [key in TypeTextures]: THREE.Texture } = {} as any;
    const loadingManager = new THREE.LoadingManager();
    loadingManager.onStart = () => {
      console.log('on start');
    };
    loadingManager.onLoad = () => {
      console.log('on load');
    };
    loadingManager.onProgress = () => {
      console.log('on progress');
    };
    loadingManager.onError = () => {
      console.log('on error');
    };
    const textureLoader = new THREE.TextureLoader(loadingManager);
    Textures.forEach((item) => {
      return (textures[item.type] = textureLoader.load(
        `${this.pathToTexture}${item.path}`
      ));
    });
    const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);
    const typeMap = 1;
    this.environmentMapTexture = cubeTextureLoader.load([
      `${this.pathToTexture}/environmentMaps/${typeMap}/px.jpg`,
      `${this.pathToTexture}/environmentMaps/${typeMap}/nx.jpg`,
      `${this.pathToTexture}/environmentMaps/${typeMap}/py.jpg`,
      `${this.pathToTexture}/environmentMaps/${typeMap}/ny.jpg`,
      `${this.pathToTexture}/environmentMaps/${typeMap}/pz.jpg`,
      `${this.pathToTexture}/environmentMaps/${typeMap}/nz.jpg`,
    ]);
    this.textures = textures;
    return textures;
  }

  @HostListener('window:resize')
  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  initThree(): void {
    this.initGui();
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x202123);
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );
    this.camera.position.set(0, 1, 100);
    // this.scene.fog = new THREE.FogExp2(0x000000, 0.025);
    this.scene.add(this.camera);

    // texture loader
    const {
      colorTexture,
      normalTexture,
      checkBoardTexture,
      smallCheckBoardTexture,
      mineCraftTexture,
      alphaTexture,
      matCapTexture,
      gradientTexture,
      ambeintOcclustionTexture,
      heightTexture,
      metalnessTexture,
      roughnessTexture,
    } = this.textureLoadMeneger();
    colorTexture.minFilter = LinearFilter;
    smallCheckBoardTexture.magFilter = NearestFilter;
    mineCraftTexture.magFilter = NearestFilter;
    mineCraftTexture.minFilter = LinearFilter;
    mineCraftTexture.generateMipmaps = false;
    // bix box geometry
    const planeGeometry = new THREE.BoxGeometry(20, 20, 20);
    // planeGeometry.rotateX(-Math.PI / 2);
    const planeMaterial = new THREE.MeshBasicMaterial({ map: normalTexture });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.y = 20;
    plane.receiveShadow = true;
    this.scene.add(plane);

    const helper = new THREE.GridHelper(2000, 100);
    const helperMaterial = helper.material as THREE.Material;
    helperMaterial.opacity = 0.25;
    helperMaterial.transparent = true;
    helper.position.y = -199;

    this.scene.add(helper);

    // one material for multiple meshes
    /*    const material = new THREE.MeshBasicMaterial();
    material.alphaMap = alphaTexture;
    material.transparent = true;
    material.map = colorTexture;
    material.side = THREE.DoubleSide; */

    /*     const material = new THREE.MeshNormalMaterial();
    material.side = THREE.DoubleSide;
    material.flatShading = true; */

    /*     const material = new THREE.MeshMatcapMaterial();
    material.matcap = matCapTexture; */

    /*  const material = new THREE.MeshPhongMaterial();
    material.shininess = 100;
    material.specular = new THREE.Color(0xff0000); */

    /*     gradientTexture.minFilter = THREE.NearestFilter;
    gradientTexture.magFilter = THREE.NearestFilter;
    gradientTexture.generateMipmaps = false;
    const material = new THREE.MeshToonMaterial();
    material.gradientMap = gradientTexture; */

    const material = new THREE.MeshStandardMaterial();
    material.metalness = 0.7;
    material.roughness = 0.2;
    material.envMap = this.environmentMapTexture;
    /*  material.map = colorTexture;
    material.aoMap = ambeintOcclustionTexture;
    material.aoMapIntensity = 1;
    material.displacementMap = heightTexture;
    material.displacementScale = 0.05;
    material.metalnessMap = metalnessTexture;
    material.roughnessMap = roughnessTexture;
    material.normalMap = normalTexture;
    material.normalScale.set(0.5, 0.5);
    material.transparent = true;
    material.alphaMap = alphaTexture; */

    this.gui.add(material, 'metalness').min(0).max(1).step(0.001);
    this.gui.add(material, 'roughness').min(0).max(1).step(0.0001);
    this.gui.add(material, 'aoMapIntensity').min(0).max(10).step(0.0001);
    this.gui.add(material, 'displacementScale').min(0).max(1).step(0.001);
    this.gui.add(material, 'wireframe');

    // const geometry = new THREE.BoxGeometry();
    const geometry = new THREE.BoxGeometry(1, 1, 1, 100, 100, 100);
    console.log(geometry.attributes);
    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);
    this.cube.receiveShadow = true;
    this.cube.geometry.setAttribute(
      'uv2',
      new THREE.BufferAttribute(this.cube.geometry.attributes.uv.array, 2)
    );
    // sphere
    this.sphereMesh = new THREE.Mesh(
      new THREE.SphereBufferGeometry(0.5, 64, 64),
      material
    );
    this.sphereMesh.position.set(2, 0, 0);
    this.sphereMesh.geometry.setAttribute(
      'uv2',
      new THREE.BufferAttribute(this.sphereMesh.geometry.attributes.uv.array, 2)
    );

    this.scene.add(this.sphereMesh);
    // plane
    const ground = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(5, 5, 100, 100),
      material
    );
    ground.receiveShadow = true;
    ground.rotateX(-Math.PI * 0.5);
    ground.position.set(1, -1, 0);
    ground.geometry.setAttribute(
      'uv2',
      new THREE.BufferAttribute(ground.geometry.attributes.uv.array, 2)
    );
    this.scene.add(ground);

    this.planeMesh = new Mesh(
      new THREE.PlaneGeometry(1, 1, 100, 100),
      material
    );
    this.planeMesh.position.set(6, 0, 0);
    this.scene.add(this.planeMesh);
    this.planeMesh.geometry.setAttribute(
      'uv2',
      new THREE.BufferAttribute(this.planeMesh.geometry.attributes.uv.array, 2)
    );

    // torus
    this.torusMesh = new THREE.Mesh(
      new THREE.TorusBufferGeometry(0.3, 0.2, 64, 128),
      material
    );
    this.torusMesh.position.set(4, 0, 0);
    this.scene.add(this.torusMesh);
    this.torusMesh.geometry.setAttribute(
      'uv2',
      new THREE.BufferAttribute(this.torusMesh.geometry.attributes.uv.array, 2)
    );

    this.scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const light = new THREE.PointLight(0xffffff, 0.5);
    light.position.set(2, 3, 4);
    light.castShadow = true;
    this.scene.add(light);
    // this.scene.add(light);

    this.camera.position.z = 5;

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    document.body.appendChild(this.renderer.domElement);
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.animate();
  }

  initGui() {
    this.gui = new dat.GUI();
  }

  animate = (): void => {
    requestAnimationFrame(this.animate);
    const elapsedTime = this.clock.getElapsedTime();
    // mesh transformation
    this.sphereMesh.rotation.y = 0.1 * elapsedTime;
    this.cube.rotation.y = 0.1 * elapsedTime;
    this.torusMesh.rotation.y = 0.1 * elapsedTime;
    this.planeMesh.rotation.y = 0.1 * elapsedTime;

    this.sphereMesh.rotation.x = 0.15 * elapsedTime;
    this.cube.rotation.x = 0.15 * elapsedTime;
    this.torusMesh.rotation.x = 0.15 * elapsedTime;
    this.planeMesh.rotation.x = 0.15 * elapsedTime;
    // rerender
    this.renderer.render(this.scene, this.camera);
  };

  ngAfterViewInit(): void {
    this.initThree();
  }
}
