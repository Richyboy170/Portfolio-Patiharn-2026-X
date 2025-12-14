"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import { Mesh } from "three";

function AnimatedSphere() {
    const sphereRef = useRef<Mesh>(null);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (sphereRef.current) {
            sphereRef.current.rotation.x = t * 0.2;
            sphereRef.current.rotation.y = t * 0.3;
            // Bobbing motion
            sphereRef.current.position.y = Math.sin(t / 1.5) / 5;
        }
    });

    return (
        <group>
            <Sphere ref={sphereRef} args={[1, 64, 64]} scale={2.5} position={[0, 0, -2]}>
                <MeshDistortMaterial
                    color="#ededed" // Light gray/whiteish for the sphere to blend with white theme
                    attach="material"
                    distort={0.4}
                    speed={1.5}
                    roughness={0.2}
                    metalness={0.8}
                />
            </Sphere>
            {/* GOLD GLITTER */}
            <Sparkles
                count={200}
                scale={12}
                size={4}
                speed={0.4}
                opacity={0.8}
                color="#FFD700"
            />
        </group>
    );
}

export function Background3D() {
    return (
        <div className="fixed inset-0 -z-50 bg-background pointer-events-none">
            <Canvas>
                <ambientLight intensity={2} />
                <directionalLight position={[0, 0, 5]} />
                <AnimatedSphere />
            </Canvas>
        </div>
    );
}
