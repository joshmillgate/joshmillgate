"use client";

import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import OrbMesh from "./OrbMesh";
import { Suspense, memo } from "react";

type OrbState = 'idle' | 'social-x' | 'social-github' | 'email' | 'work' | 'location';

interface ShaderOrbProps {
    orbState: OrbState;
    mousePosition: { x: number; y: number };
    clickTime?: number;
    linkHoverIntensity?: number;
}

// Memoize the inner canvas to prevent re-mounting on parent re-renders
const MemoizedCanvas = memo(function InnerCanvas({ orbState, mousePosition, clickTime = 0, linkHoverIntensity = 0 }: ShaderOrbProps) {
    return (
        <Canvas
            camera={{ position: [0, 0, 3], fov: 50 }}
            gl={{
                alpha: true,
                antialias: true,
                powerPreference: 'high-performance',
            }}
            dpr={[1, 2]}
            style={{ background: 'transparent' }}
            // Keep animation running even when not visible
            frameloop="always"
        >
            <Suspense fallback={null}>
                <OrbMesh orbState={orbState} mousePosition={mousePosition} clickTime={clickTime} linkHoverIntensity={linkHoverIntensity} />

                <EffectComposer>
                    <Bloom
                        intensity={orbState !== 'idle' ? 1.0 : 0.5}
                        luminanceThreshold={0.6} // Higher threshold to only bloom highlights
                        luminanceSmoothing={0.7}
                        mipmapBlur
                        radius={0.4} // Smaller radius to keep it contained
                    />
                </EffectComposer>
            </Suspense>
        </Canvas>
    );
});

export default memo(function ShaderOrb({ orbState, mousePosition, clickTime = 0, linkHoverIntensity = 0 }: ShaderOrbProps) {
    return (
        <div style={{ width: '100%', height: '100%', minWidth: '42px', minHeight: '42px' }}>
            <MemoizedCanvas orbState={orbState} mousePosition={mousePosition} clickTime={clickTime} linkHoverIntensity={linkHoverIntensity} />
        </div>
    );
});
