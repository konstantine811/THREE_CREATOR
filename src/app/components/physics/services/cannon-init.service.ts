import { Injectable } from '@angular/core';
// libs
import * as CANNON from 'cannon-es';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root',
})
export class CannonInitService {
  constructor() {}

  createCannonTrimesh(geometry: THREE.BufferGeometry): CANNON.Trimesh {
    const posAttr = geometry.attributes.position;
    const vertices = geometry.attributes.position.array as number[];
    let indices = [];
    for (let i = 0; i < posAttr.count; i++) {
      indices.push(i);
    }
    return new CANNON.Trimesh(vertices, indices);
  }

  createCannonConvex(geometry: THREE.BufferGeometry): CANNON.ConvexPolyhedron {
    const posAttr = geometry.attributes.position;
    const floats = geometry.attributes.position.array;
    const vertices: CANNON.Vec3[] = [];
    const faces: number[][] = [];
    let face = [];
    let index = 0;
    for (let i = 0; i < posAttr.count; i += 3) {
      vertices.push(new CANNON.Vec3(floats[i], floats[i + 1], floats[i + 2]));
      face.push(index++);
      if (face.length === 3) {
        faces.push(face);
        face = [];
      }
    }

    return new CANNON.ConvexPolyhedron({ vertices, faces });
  }
}
