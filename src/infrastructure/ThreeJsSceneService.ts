import * as THREE from 'three';
import { SceneService } from '../domain/services/SceneService';
import { SceneObject, SceneState, Vector3D, CameraSettings } from '../domain/models/Scene';
import { v4 as uuidv4 } from 'uuid';

export class ThreeJsSceneService implements SceneService {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private objectsMap: Map<string, THREE.Object3D>;
  private subscribers: ((state: SceneState) => void)[];

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.objectsMap = new Map();
    this.subscribers = [];

    // Set initial camera position
    this.camera.position.z = 5;
  }

  getSceneState(): SceneState {
    return {
      objects: Array.from(this.objectsMap.entries()).map(([id, obj]) => ({
        id,
        position: this.convertToVector3D(obj.position),
        rotation: this.convertToVector3D(obj.rotation),
        scale: this.convertToVector3D(obj.scale)
      })),
      camera: {
        position: this.convertToVector3D(this.camera.position),
        target: this.convertToVector3D(new THREE.Vector3()),
        fov: this.camera.fov
      }
    };
  }

  addObject(object: Omit<SceneObject, 'id'>): SceneObject {
    const id = uuidv4();
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(),
      new THREE.MeshStandardMaterial({ color: 0x00ff00 })
    );

    mesh.position.set(object.position.x, object.position.y, object.position.z);
    mesh.rotation.set(object.rotation.x, object.rotation.y, object.rotation.z);
    mesh.scale.set(object.scale.x, object.scale.y, object.scale.z);

    this.scene.add(mesh);
    this.objectsMap.set(id, mesh);

    const newObject = { id, ...object };
    this.notifySubscribers();
    return newObject;
  }

  removeObject(objectId: string): void {
    const object = this.objectsMap.get(objectId);
    if (object) {
      this.scene.remove(object);
      this.objectsMap.delete(objectId);
      this.notifySubscribers();
    }
  }

  updateObjectPosition(objectId: string, position: Vector3D): void {
    const object = this.objectsMap.get(objectId);
    if (object) {
      object.position.set(position.x, position.y, position.z);
      this.notifySubscribers();
    }
  }

  updateObjectRotation(objectId: string, rotation: Vector3D): void {
    const object = this.objectsMap.get(objectId);
    if (object) {
      object.rotation.set(rotation.x, rotation.y, rotation.z);
      this.notifySubscribers();
    }
  }

  updateObjectScale(objectId: string, scale: Vector3D): void {
    const object = this.objectsMap.get(objectId);
    if (object) {
      object.scale.set(scale.x, scale.y, scale.z);
      this.notifySubscribers();
    }
  }

  setCameraPosition(position: Vector3D): void {
    this.camera.position.set(position.x, position.y, position.z);
    this.notifySubscribers();
  }

  setCameraTarget(target: Vector3D): void {
    this.camera.lookAt(new THREE.Vector3(target.x, target.y, target.z));
    this.notifySubscribers();
  }

  setCameraFOV(fov: number): void {
    this.camera.fov = fov;
    this.camera.updateProjectionMatrix();
    this.notifySubscribers();
  }

  subscribe(callback: (state: SceneState) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  private convertToVector3D(vector: THREE.Vector3 | THREE.Euler): Vector3D {
    return {
      x: vector.x,
      y: vector.y,
      z: vector.z
    };
  }

  private notifySubscribers(): void {
    const state = this.getSceneState();
    this.subscribers.forEach(callback => callback(state));
  }

  // Method to get the Three.js scene and camera for rendering
  getThreeJsObjects(): { scene: THREE.Scene; camera: THREE.PerspectiveCamera } {
    return { scene: this.scene, camera: this.camera };
  }
}