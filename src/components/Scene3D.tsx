'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ThreeJsSceneService } from '../infrastructure/ThreeJsSceneService';
import { Vector3D } from '../domain/models/Scene';

export default function Scene3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneServiceRef = useRef<ThreeJsSceneService | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize scene service
    const sceneService = new ThreeJsSceneService();
    sceneServiceRef.current = sceneService;

    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Add ambient light
    const { scene } = sceneService.getThreeJsObjects();
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Add initial object
    const initialObject: Vector3D = {
      x: 0,
      y: 0,
      z: 0
    };
    sceneService.addObject({
      position: initialObject,
      rotation: initialObject,
      scale: { x: 1, y: 1, z: 1 }
    });

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      const { scene, camera } = sceneService.getThreeJsObjects();
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      const { camera } = sceneService.getThreeJsObjects();
      const aspect = window.innerWidth / window.innerHeight;
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.aspect = aspect;
        camera.updateProjectionMatrix();
      }
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="w-full h-screen" />;
}