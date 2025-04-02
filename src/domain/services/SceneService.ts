// Domain service interface for scene management
import { SceneObject, SceneState, Vector3D } from '../models/Scene';

export interface SceneService {
  // Scene state management
  getSceneState(): SceneState;
  
  // Object manipulation
  addObject(object: Omit<SceneObject, 'id'>): SceneObject;
  removeObject(objectId: string): void;
  updateObjectPosition(objectId: string, position: Vector3D): void;
  updateObjectRotation(objectId: string, rotation: Vector3D): void;
  updateObjectScale(objectId: string, scale: Vector3D): void;
  
  // Camera controls
  setCameraPosition(position: Vector3D): void;
  setCameraTarget(target: Vector3D): void;
  setCameraFOV(fov: number): void;
  
  // Scene event handling
  subscribe(callback: (state: SceneState) => void): () => void;
}