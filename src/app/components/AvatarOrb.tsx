"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

type OrbState = 'idle' | 'social-x' | 'social-github' | 'email' | 'work' | 'location';

interface AvatarOrbProps {
    orbState: OrbState;
    mousePosition: { x: number; y: number };
}

export default function AvatarOrb({ orbState, mousePosition }: AvatarOrbProps) {
    const [proximityGlow, setProximityGlow] = useState(0);
    const [velocityStrength, setVelocityStrength] = useState(0);
    const orbRef = useRef<HTMLDivElement>(null);
    const lastMouseRef = useRef({ x: 0, y: 0, time: 0 });

    // Orb state colors for different interactions
    const getOrbStateColor = (state: OrbState) => {
        switch (state) {
            case 'social-x': return '#1DA1F2';
            case 'social-github': return '#6e5494';
            case 'email': return '#5DD5C3';
            case 'work': return '#FF9F66';
            case 'location': return '#22c55e';
            default: return '#7BE0D4';
        }
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const now = Date.now();
            const dt = now - lastMouseRef.current.time;

            if (dt > 0) {
                // Calculate velocity
                const dx = e.clientX - lastMouseRef.current.x;
                const dy = e.clientY - lastMouseRef.current.y;
                const velocity = Math.sqrt(dx * dx + dy * dy) / dt;

                // Update velocity strength for chromatic aberration
                setVelocityStrength(Math.min(velocity * 10, 1));
            }

            // Calculate proximity to orb
            if (orbRef.current) {
                const orbRect = orbRef.current.getBoundingClientRect();
                const orbCenterX = orbRect.left + orbRect.width / 2;
                const orbCenterY = orbRect.top + orbRect.height / 2;
                const distance = Math.sqrt(
                    Math.pow(e.clientX - orbCenterX, 2) + Math.pow(e.clientY - orbCenterY, 2)
                );
                // Map distance (0-500px) to glow intensity (1-0)
                const glowIntensity = Math.max(0, Math.min(1, 1 - distance / 500));
                setProximityGlow(glowIntensity);
            }

            lastMouseRef.current = { x: e.clientX, y: e.clientY, time: now };
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div
            className="home-avatar-wrapper"
            style={{
                '--orb-glow-intensity': proximityGlow,
                '--orb-state-color': getOrbStateColor(orbState),
            } as React.CSSProperties}
        >
            <div
                ref={orbRef}
                className={`home-avatar ${orbState === 'idle' ? 'orb-idle' : ''} ${velocityStrength > 0.5 ? 'orb-velocity-high' : ''}`}
                style={{
                    '--mouse-x': `${mousePosition.x}%`,
                    '--mouse-y': `${mousePosition.y}%`,
                    '--aberration-strength': velocityStrength,
                } as React.CSSProperties}
            >
                <div className="home-avatar-noise" />
                <div className="home-avatar-scanline" />
            </div>
        </div>
    );
}
