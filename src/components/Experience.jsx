import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import Tree from './Tree';
import PhotoWall from './PhotoWall';
import { useStore } from '../store/useStore';

export default function Experience() {
    return (
        <Canvas gl={{ antialias: false, powerPreference: "high-performance" }} dpr={[1, 2]}>
            <PerspectiveCamera makeDefault position={[0, 0, 30]} fov={50} />
            <OrbitControls enableZoom={true} enablePan={false} autoRotate autoRotateSpeed={0.5} />

            {/* Lights */}
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1.5} color="#F9E5BC" />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#2A5F3A" />
            <spotLight position={[0, 20, 0]} angle={0.3} penumbra={1} intensity={2} color="#D4AF37" />

            <Suspense fallback={null}>
                <Environment preset="city" />
            </Suspense>

            {/* Content */}
            <group position={[0, 0, 0]}>
                <Tree />
                <PhotoWall />
            </group>

            {/* Post Processing */}
            <EffectComposer disableNormalPass>
                <Bloom luminanceThreshold={0.5} mipmapBlur intensity={1.5} radius={0.4} />
                <Vignette eskil={false} offset={0.1} darkness={1.1} />
            </EffectComposer>
        </Canvas>
    );
}
