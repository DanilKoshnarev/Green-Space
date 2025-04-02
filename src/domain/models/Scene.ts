// Domain model for 3D scene management
export interface SceneObject {
  id: string;
  position: Vector3D;
  rotation: Vector3D;
  scale: Vector3D;
}

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface SceneState {
  objects: SceneObject[];
  camera: CameraSettings;
}

export interface CameraSettings {
  position: Vector3D;
  target: Vector3D;
  fov: number;
}

// Domain events
export interface SceneObjectAdded {
  type: 'SceneObjectAdded';
  object: SceneObject;
}

export interface SceneObjectRemoved {
  type: 'SceneObjectRemoved';
  objectId: string;
}

export type SceneEvent = SceneObjectAdded | SceneObjectRemoved;