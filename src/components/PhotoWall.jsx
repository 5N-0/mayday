import React, { useRef, useMemo } from 'react';
import { useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../store/useStore';

const PHOTO_URLS = [
    'picture/bule.png',
    'picture/green.png',
    'picture/orange.png',
    'picture/pink.png',
    'picture/yellow.png'
];

function PhotoItem({ url, index, total }) {
    const meshRef = useRef();
    const phase = useStore(state => state.phase);
    const texture = useTexture(url);

    // Geometry logic
    const isLandscape = texture.image && (texture.image.width > texture.image.height);

    // Target Positions
    // Tree: Spiral inside
    const angleTree = index * 0.5;
    const hTree = (index / total) * 10 - 5;
    const rTree = (1 - (hTree + 5) / 10) * 3;
    const posTree = new THREE.Vector3(Math.cos(angleTree) * rTree, hTree, Math.sin(angleTree) * rTree);

    // Nebula: Ring
    const angleNebula = (index / total) * Math.PI * 2;
    const posNebula = new THREE.Vector3(Math.cos(angleNebula) * 20, 0, Math.sin(angleNebula) * 20);

    useFrame((state, delta) => {
        if (!meshRef.current) return;

        let target = new THREE.Vector3();
        if (phase === 'tree') target.copy(posTree);
        else target.copy(posNebula); // nebula, blooming, collapsing eventually go here

        // Simple Lerp
        meshRef.current.position.lerp(target, 0.05);

        // Orientation
        if (phase === 'tree') {
            meshRef.current.lookAt(0, meshRef.current.position.y, 0);
        } else {
            meshRef.current.lookAt(0, 0, 0); // Look at center
            // Rotate for carousel later
        }
    });

    return (
        <mesh ref={meshRef}>
            <planeGeometry args={[2, 2.5]} />
            <meshBasicMaterial map={texture} side={THREE.DoubleSide} transparent />
            {/* Frame border */}
            <mesh position={[0, 0, -0.01]}>
                <planeGeometry args={[2.2, 2.7]} />
                <meshBasicMaterial color="#D4AF37" />
            </mesh>
        </mesh>
    );
}

export default function PhotoWall() {
    return (
        <group>
            {[...Array(24)].map((_, i) => (
                <PhotoItem
                    key={i}
                    url={PHOTO_URLS[i % PHOTO_URLS.length]}
                    index={i}
                    total={24}
                />
            ))}
        </group>
    );
}
