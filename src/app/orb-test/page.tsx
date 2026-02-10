"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useCallback } from "react";

// Dynamic import to prevent SSR issues with Three.js
const ShaderOrb = dynamic(
    () => import("../components/ShaderOrb"),
    { ssr: false }
);

type OrbState = 'idle' | 'social-x' | 'social-github' | 'email' | 'work' | 'location';

export default function OrbTestPage() {
    const [orbState, setOrbState] = useState<OrbState>('idle');
    const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
    const [clickTime, setClickTime] = useState(0);

    // Global window mouse tracking
    useEffect(() => {
        let lastUpdate = 0;

        const handleMouseMove = (e: MouseEvent) => {
            const now = Date.now();
            // Throttle to ~60fps
            if (now - lastUpdate < 16) return;
            lastUpdate = now;

            setMousePosition({
                x: (e.clientX / window.innerWidth) * 100,
                y: (e.clientY / window.innerHeight) * 100,
            });
        };

        // Click triggers ripple
        const handleClick = () => {
            setClickTime(Date.now());
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('click', handleClick);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('click', handleClick);
        };
    }, []);

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "32px",
                background: "#f8fafc",
                padding: "48px",
            }}
        >
            <h1 style={{ color: "#1e293b", fontSize: "24px", fontWeight: 600 }}>WebGL Shader Orb Test</h1>

            {/* Large orb container for better visibility */}
            <div
                style={{
                    width: "280px",
                    height: "280px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    // background: "#FAFAFA",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
                }}
            >
                <ShaderOrb orbState={orbState} mousePosition={mousePosition} clickTime={clickTime} />
            </div>

            {/* State selector buttons */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
                {(['idle', 'social-x', 'social-github', 'email', 'work', 'location'] as OrbState[]).map((state) => (
                    <button
                        key={state}
                        onClick={(e) => {
                            e.stopPropagation(); // Don't trigger orb ripple on button click
                            setOrbState(state);
                        }}
                        style={{
                            padding: "12px 24px",
                            borderRadius: "8px",
                            border: "none",
                            background: orbState === state ? "#6366f1" : "#e2e8f0",
                            color: orbState === state ? "#fff" : "#475569",
                            cursor: "pointer",
                            fontSize: "14px",
                            fontWeight: 500,
                            transition: "all 0.2s ease",
                        }}
                    >
                        {state}
                    </button>
                ))}
            </div>

            {/* Debug info */}
            <div style={{ color: "#64748b", fontSize: "12px", textAlign: "center" }}>
                <p>Current state: <strong style={{ color: "#6366f1" }}>{orbState}</strong></p>
                <p style={{ marginTop: "4px" }}>Click anywhere to trigger ripple!</p>
            </div>
        </div>
    );
}
