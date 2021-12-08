export enum TypeTextures {
  color = 'colorTexture',
  alpha = 'alphaTexture',
  height = 'heightTexture',
  normal = 'normalTexture',
  ambientOcclustion = 'ambeintOcclustionTexture',
  metalness = 'metalnessTexture',
  roughness = 'roughnessTexture',
  checkBoard = 'checkBoardTexture',
  smallCheckBoard = 'smallCheckBoardTexture',
  mineCraft = 'mineCraftTexture',
  matCap = 'matCapTexture',
  gradient = 'gradientTexture',
}

export interface ITexture {
  path: string;
  type: TypeTextures;
}

export const Textures: ITexture[] = [
  {
    path: '/minecraft.png',
    type: TypeTextures.mineCraft,
  },
  {
    path: '/checkerboard-1024x1024.png',
    type: TypeTextures.checkBoard,
  },
  {
    path: '/checkerboard-8x8.png',
    type: TypeTextures.smallCheckBoard,
  },
  {
    path: '/door/color.jpg',
    type: TypeTextures.color,
  },
  {
    path: '/door/alpha.jpg',
    type: TypeTextures.alpha,
  },
  {
    path: '/door/height.jpg',
    type: TypeTextures.height,
  },
  {
    path: '/door/normal.jpg',
    type: TypeTextures.normal,
  },
  {
    path: '/door/ambientOcclusion.jpg',
    type: TypeTextures.ambientOcclustion,
  },
  {
    path: '/door/metalness.jpg',
    type: TypeTextures.metalness,
  },
  {
    path: '/door/roughness.jpg',
    type: TypeTextures.roughness,
  },
  {
    path: '/matcaps/8.png',
    type: TypeTextures.matCap,
  },
  {
    path: '/gradients/5.jpg',
    type: TypeTextures.gradient,
  },
];
