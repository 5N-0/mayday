import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../store/useStore';
import gsap from 'gsap';

// Shader Injection Logic
const CustomMaterial = {
    onBeforeCompile: (shader) => {
        shader.uniforms.uTime = { value: 0 };
        shader.uniforms.uMix = { value: 0 };
        shader.uniforms.uExplode = { value: 0 };

        shader.vertexShader = `
      uniform float uTime;
      uniform float uMix;
      uniform float uExplode;
      attribute vec3 aPosTree;
      attribute vec3 aPosNebula;
      attribute vec3 aColor;
      attribute float aScale;
      varying vec3 vColor;
    ` + shader.vertexShader;

        shader.vertexShader = shader.vertexShader.replace(
            '#include <begin_vertex>',
            `
      vec3 p1 = aPosTree;
      vec3 p2 = aPosNebula;
      
      // Mix Phases
      vec3 targetPos = mix(p1, p2, uMix);
      
      // Explosion effect (push out)
      if (uExplode > 0.0) {
        targetPos += normalize(targetPos) * uExplode * 10.0;
      }

      // Hover ripple (simple time wave for now as placeholder for interaction)
      // For real mouse interaction, we'd need a raycaster uniform, but let's keep it visual first.
      
      vec3 transformed = vec3(position) * aScale;
      transformed += targetPos;
      
      vColor = aColor;
      `
        );

        shader.fragmentShader = `varying vec3 vColor;` + shader.fragmentShader;
        shader.fragmentShader = shader.fragmentShader.replace(
            '#include <color_fragment>',
            `#include <color_fragment>
      diffuseColor.rgb *= vColor;`
        );

        // Assign to userdata so we can access it in loop
        shader.userData = { isCustom: true };
    }
};

export default function Tree() {
    const meshRef = useRef();
    const materialRef = useRef();
    const phase = useStore(state => state.phase);

    const count = 5000;

    // Generate Data
    const { posTree, posNebula, colors, scales } = useMemo(() => {
        const pTree = new Float32Array(count * 3);
        const pNebula = new Float32Array(count * 3);
        const col = new Float32Array(count * 3);
        const sc = new Float32Array(count);

        const palette = [
            new THREE.Color('#2A5F3A'), // Green
            new THREE.Color('#D4AF37'), // Gold
        ];

        for (let i = 0; i < count; i++) {
            // Tree: Cone
            const angle = i * 0.5;
            const h = (i / count) * 15 - 7.5;
            const r = (1 - (h + 7.5) / 15) * 6;
            const randR = r + (Math.random() - 0.5);
            pTree[i * 3] = Math.cos(angle) * randR;
            pTree[i * 3 + 1] = h;
            pTree[i * 3 + 2] = Math.sin(angle) * randR;

            // Nebula: Ring
            const nebulaAngle = Math.random() * Math.PI * 2;
            const nebulaRad = 15 + Math.random() * 10;
            const y = (Math.random() - 0.5) * 5;
            pNebula[i * 3] = Math.cos(nebulaAngle) * nebulaRad;
            pNebula[i * 3 + 1] = y;
            pNebula[i * 3 + 2] = Math.sin(nebulaAngle) * nebulaRad;

            // Color
            const c = palette[Math.floor(Math.random() * palette.length)];
            col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;

            // Scale
            sc[i] = Math.random() * 0.5 + 0.1;
        }
        return { posTree, posNebula, colors: col, scales: sc };
    }, []);

    // Phase Logic
    useEffect(() => {
        if (!materialRef.current) return;
        // We can't access uniforms directly on the material object easily until it compiles.
        // But we can tween a valueRef or state.
    }, [phase]);

    // Since uniforms are deep inside onBeforeCompile, we usually keep a ref to the shader
    const shaderRef = useRef();

    useFrame((state, delta) => {
        if (!shaderRef.current && materialRef.current && materialRef.current.userData && materialRef.current.userData.shader) {
            shaderRef.current = materialRef.current.userData.shader;
        }

        if (shaderRef.current) {
            shaderRef.current.uniforms.uTime.value += delta;

            // GSAP-like logic in loop or use real GSAP to tween a value
            // Let's us simple lerp for simplicity here
            const targetMix = (phase === 'nebula' || phase === 'blooming') ? 1 : 0;
            const currentMix = shaderRef.current.uniforms.uMix.value;
            shaderRef.current.uniforms.uMix.value = THREE.MathUtils.lerp(currentMix, targetMix, 0.05);

            // Explosion transient
            const targetExplode = (phase === 'blooming') ? 1 : 0;
            const currentExplode = shaderRef.current.uniforms.uExplode.value;
            shaderRef.current.uniforms.uExplode.value = THREE.MathUtils.lerp(currentExplode, targetExplode, 0.1);
        }
    });

    return (
        <instancedMesh ref={meshRef} args={[null, null, count]}>
            <sphereGeometry args={[0.2, 8, 8]}>
                <instancedBufferAttribute attach="attributes-aPosTree" args={[posTree, 3]} />
                <instancedBufferAttribute attach="attributes-aPosNebula" args={[posNebula, 3]} />
                <instancedBufferAttribute attach="attributes-aColor" args={[colors, 3]} />
                <instancedBufferAttribute attach="attributes-aScale" args={[scales, 1]} />
            </sphereGeometry>
            <meshStandardMaterial
                ref={materialRef}
                color="#ffffff"
                roughness={0.4}
                metalness={0.8}
                onBeforeCompile={(shader) => {
                    CustomMaterial.onBeforeCompile(shader);
                    materialRef.current.userData.shader = shader;
                }}
            />
        </instancedMesh>
    );
}
