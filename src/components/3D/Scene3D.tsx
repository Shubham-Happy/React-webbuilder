import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BuilderElement, Element3DProps } from '../../types';
import './Scene3D.css';

interface Scene3DProps {
  element: BuilderElement;
}

interface Primitive3DProps {
  type: 'box' | 'sphere' | 'torus';
  props3d: Element3DProps;
}

function AnimatedMesh({ type, props3d }: Primitive3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((_, delta) => {
    if (meshRef.current && props3d.animate) {
      meshRef.current.rotation.x += delta * 0.5 * (props3d.animationSpeed || 1);
      meshRef.current.rotation.y += delta * 0.3 * (props3d.animationSpeed || 1);
    }
  });

  const position: [number, number, number] = [
    props3d.positionX || 0,
    props3d.positionY || 0,
    props3d.positionZ || 0
  ];

  const rotation: [number, number, number] = [
    (props3d.rotationX || 0) * Math.PI / 180,
    (props3d.rotationY || 0) * Math.PI / 180,
    (props3d.rotationZ || 0) * Math.PI / 180
  ];

  const scale: [number, number, number] = [
    props3d.scaleX || 1,
    props3d.scaleY || 1,
    props3d.scaleZ || 1
  ];

  const getGeometry = () => {
    switch (type) {
      case 'sphere':
        return <sphereGeometry args={[1, 32, 32]} />;
      case 'torus':
        return <torusGeometry args={[1, 0.4, 16, 48]} />;
      case 'box':
      default:
        return <boxGeometry args={[1.5, 1.5, 1.5]} />;
    }
  };

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={scale}
    >
      {getGeometry()}
      <meshStandardMaterial
        color={props3d.color || '#6366f1'}
        metalness={props3d.metalness ?? 0.5}
        roughness={props3d.roughness ?? 0.5}
        wireframe={props3d.wireframe ?? false}
      />
    </mesh>
  );
}

function Scene3D({ element }: Scene3DProps) {
  // Find 3D primitive children
  const primitives = element.children.filter(child => 
    ['box3d', 'sphere3d', 'torus3d'].includes(child.type)
  );

  // Default primitives if none added
  const defaultPrimitives = primitives.length === 0 ? [
    {
      id: 'default-box',
      type: 'box3d' as const,
      props3d: {
        positionX: 0,
        positionY: 0,
        positionZ: 0,
        color: '#6366f1',
        metalness: 0.5,
        roughness: 0.5,
        animate: true,
        animationSpeed: 1
      }
    }
  ] : [];

  return (
    <div className="scene3d-container" style={element.styles as React.CSSProperties}>
      <Canvas
        camera={{ position: [3, 3, 3], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#8b5cf6" />
        
        <Environment preset="city" />
        
        {primitives.map(primitive => (
          <AnimatedMesh
            key={primitive.id}
            type={primitive.type.replace('3d', '') as 'box' | 'sphere' | 'torus'}
            props3d={primitive.props3d || {}}
          />
        ))}
        
        {defaultPrimitives.map(primitive => (
          <AnimatedMesh
            key={primitive.id}
            type={primitive.type.replace('3d', '') as 'box' | 'sphere' | 'torus'}
            props3d={primitive.props3d}
          />
        ))}
        
        <OrbitControls 
          enableZoom={true}
          enablePan={true}
          minDistance={2}
          maxDistance={10}
        />
      </Canvas>
    </div>
  );
}

export default Scene3D;
