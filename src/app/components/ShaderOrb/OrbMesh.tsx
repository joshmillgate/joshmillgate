"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Based on Bruno Simon's organic-sphere
// https://github.com/brunosimon/organic-sphere
const vertexShader = `
#define M_PI 3.1415926535897932384626433832795

uniform vec3 uLightAColor;
uniform vec3 uLightAPosition;
uniform float uLightAIntensity;
uniform vec3 uLightBColor;
uniform vec3 uLightBPosition;
uniform float uLightBIntensity;

uniform float uDistortionFrequency;
uniform float uDistortionStrength;
uniform float uDisplacementFrequency;
uniform float uDisplacementStrength;

uniform float uFresnelOffset;
uniform float uFresnelMultiplier;
uniform float uFresnelPower;

uniform float uTime;
uniform float uRipple; // 0 to 1, travels from bottom to top
uniform vec2 uMouseVelocity; // Mouse movement direction and speed

varying vec3 vColor;

// 4D Perlin noise for smooth organic movement
vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec4 fade(vec4 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

float perlin4d(vec4 P) {
    vec4 Pi0 = floor(P);
    vec4 Pi1 = Pi0 + 1.0;
    Pi0 = mod(Pi0, 289.0);
    Pi1 = mod(Pi1, 289.0);
    vec4 Pf0 = fract(P);
    vec4 Pf1 = Pf0 - 1.0;
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = vec4(Pi0.z);
    vec4 iz1 = vec4(Pi1.z);
    vec4 iw0 = vec4(Pi0.w);
    vec4 iw1 = vec4(Pi1.w);

    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);
    vec4 ixy00 = permute(ixy0 + iw0);
    vec4 ixy01 = permute(ixy0 + iw1);
    vec4 ixy10 = permute(ixy1 + iw0);
    vec4 ixy11 = permute(ixy1 + iw1);

    vec4 gx00 = ixy00 / 7.0;
    vec4 gy00 = floor(gx00) / 7.0;
    vec4 gz00 = floor(gy00) / 6.0;
    gx00 = fract(gx00) - 0.5;
    gy00 = fract(gy00) - 0.5;
    gz00 = fract(gz00) - 0.5;
    vec4 gw00 = vec4(0.75) - abs(gx00) - abs(gy00) - abs(gz00);
    vec4 sw00 = step(gw00, vec4(0.0));
    gx00 -= sw00 * (step(0.0, gx00) - 0.5);
    gy00 -= sw00 * (step(0.0, gy00) - 0.5);

    vec4 gx01 = ixy01 / 7.0;
    vec4 gy01 = floor(gx01) / 7.0;
    vec4 gz01 = floor(gy01) / 6.0;
    gx01 = fract(gx01) - 0.5;
    gy01 = fract(gy01) - 0.5;
    gz01 = fract(gz01) - 0.5;
    vec4 gw01 = vec4(0.75) - abs(gx01) - abs(gy01) - abs(gz01);
    vec4 sw01 = step(gw01, vec4(0.0));
    gx01 -= sw01 * (step(0.0, gx01) - 0.5);
    gy01 -= sw01 * (step(0.0, gy01) - 0.5);

    vec4 gx10 = ixy10 / 7.0;
    vec4 gy10 = floor(gx10) / 7.0;
    vec4 gz10 = floor(gy10) / 6.0;
    gx10 = fract(gx10) - 0.5;
    gy10 = fract(gy10) - 0.5;
    gz10 = fract(gz10) - 0.5;
    vec4 gw10 = vec4(0.75) - abs(gx10) - abs(gy10) - abs(gz10);
    vec4 sw10 = step(gw10, vec4(0.0));
    gx10 -= sw10 * (step(0.0, gx10) - 0.5);
    gy10 -= sw10 * (step(0.0, gy10) - 0.5);

    vec4 gx11 = ixy11 / 7.0;
    vec4 gy11 = floor(gx11) / 7.0;
    vec4 gz11 = floor(gy11) / 6.0;
    gx11 = fract(gx11) - 0.5;
    gy11 = fract(gy11) - 0.5;
    gz11 = fract(gz11) - 0.5;
    vec4 gw11 = vec4(0.75) - abs(gx11) - abs(gy11) - abs(gz11);
    vec4 sw11 = step(gw11, vec4(0.0));
    gx11 -= sw11 * (step(0.0, gx11) - 0.5);
    gy11 -= sw11 * (step(0.0, gy11) - 0.5);

    vec4 g0000 = vec4(gx00.x,gy00.x,gz00.x,gw00.x);
    vec4 g1000 = vec4(gx00.y,gy00.y,gz00.y,gw00.y);
    vec4 g0100 = vec4(gx00.z,gy00.z,gz00.z,gw00.z);
    vec4 g1100 = vec4(gx00.w,gy00.w,gz00.w,gw00.w);
    vec4 g0010 = vec4(gx10.x,gy10.x,gz10.x,gw10.x);
    vec4 g1010 = vec4(gx10.y,gy10.y,gz10.y,gw10.y);
    vec4 g0110 = vec4(gx10.z,gy10.z,gz10.z,gw10.z);
    vec4 g1110 = vec4(gx10.w,gy10.w,gz10.w,gw10.w);
    vec4 g0001 = vec4(gx01.x,gy01.x,gz01.x,gw01.x);
    vec4 g1001 = vec4(gx01.y,gy01.y,gz01.y,gw01.y);
    vec4 g0101 = vec4(gx01.z,gy01.z,gz01.z,gw01.z);
    vec4 g1101 = vec4(gx01.w,gy01.w,gz01.w,gw01.w);
    vec4 g0011 = vec4(gx11.x,gy11.x,gz11.x,gw11.x);
    vec4 g1011 = vec4(gx11.y,gy11.y,gz11.y,gw11.y);
    vec4 g0111 = vec4(gx11.z,gy11.z,gz11.z,gw11.z);
    vec4 g1111 = vec4(gx11.w,gy11.w,gz11.w,gw11.w);

    vec4 norm00 = taylorInvSqrt(vec4(dot(g0000, g0000), dot(g0100, g0100), dot(g1000, g1000), dot(g1100, g1100)));
    g0000 *= norm00.x; g0100 *= norm00.y; g1000 *= norm00.z; g1100 *= norm00.w;

    vec4 norm01 = taylorInvSqrt(vec4(dot(g0001, g0001), dot(g0101, g0101), dot(g1001, g1001), dot(g1101, g1101)));
    g0001 *= norm01.x; g0101 *= norm01.y; g1001 *= norm01.z; g1101 *= norm01.w;

    vec4 norm10 = taylorInvSqrt(vec4(dot(g0010, g0010), dot(g0110, g0110), dot(g1010, g1010), dot(g1110, g1110)));
    g0010 *= norm10.x; g0110 *= norm10.y; g1010 *= norm10.z; g1110 *= norm10.w;

    vec4 norm11 = taylorInvSqrt(vec4(dot(g0011, g0011), dot(g0111, g0111), dot(g1011, g1011), dot(g1111, g1111)));
    g0011 *= norm11.x; g0111 *= norm11.y; g1011 *= norm11.z; g1111 *= norm11.w;

    float n0000 = dot(g0000, Pf0);
    float n1000 = dot(g1000, vec4(Pf1.x, Pf0.yzw));
    float n0100 = dot(g0100, vec4(Pf0.x, Pf1.y, Pf0.zw));
    float n1100 = dot(g1100, vec4(Pf1.xy, Pf0.zw));
    float n0010 = dot(g0010, vec4(Pf0.xy, Pf1.z, Pf0.w));
    float n1010 = dot(g1010, vec4(Pf1.x, Pf0.y, Pf1.z, Pf0.w));
    float n0110 = dot(g0110, vec4(Pf0.x, Pf1.yz, Pf0.w));
    float n1110 = dot(g1110, vec4(Pf1.xyz, Pf0.w));
    float n0001 = dot(g0001, vec4(Pf0.xyz, Pf1.w));
    float n1001 = dot(g1001, vec4(Pf1.x, Pf0.yz, Pf1.w));
    float n0101 = dot(g0101, vec4(Pf0.x, Pf1.y, Pf0.z, Pf1.w));
    float n1101 = dot(g1101, vec4(Pf1.xy, Pf0.z, Pf1.w));
    float n0011 = dot(g0011, vec4(Pf0.xy, Pf1.zw));
    float n1011 = dot(g1011, vec4(Pf1.x, Pf0.y, Pf1.zw));
    float n0111 = dot(g0111, vec4(Pf0.x, Pf1.yzw));
    float n1111 = dot(g1111, Pf1);

    vec4 fade_xyzw = fade(Pf0);
    vec4 n_0w = mix(vec4(n0000, n1000, n0100, n1100), vec4(n0001, n1001, n0101, n1101), fade_xyzw.w);
    vec4 n_1w = mix(vec4(n0010, n1010, n0110, n1110), vec4(n0011, n1011, n0111, n1111), fade_xyzw.w);
    vec4 n_zw = mix(n_0w, n_1w, fade_xyzw.z);
    vec2 n_yzw = mix(n_zw.xy, n_zw.zw, fade_xyzw.y);
    float n_xyzw = mix(n_yzw.x, n_yzw.y, fade_xyzw.x);
    return 2.2 * n_xyzw;
}

vec3 getDisplacedPosition(vec3 _position) {
    // First layer: distortion (warps the sampling space)
    vec3 distortedPosition = _position;
    distortedPosition += perlin4d(vec4(distortedPosition * uDistortionFrequency, uTime)) * uDistortionStrength;

    // Second layer: displacement along normal
    float perlinStrength = perlin4d(vec4(distortedPosition * uDisplacementFrequency, uTime));
    
    vec3 displacedPosition = _position; // Use original position for output
    displacedPosition += normalize(_position) * perlinStrength * uDisplacementStrength;
    
    // Third layer: directional displacement based on mouse velocity
    // Push vertices away from mouse movement direction
    if (length(uMouseVelocity) > 0.01) {
        // Project mouse velocity onto the sphere surface
        // Create a 3D direction vector from 2D mouse velocity (x, y, 0)
        vec3 mouseDir3D = normalize(vec3(uMouseVelocity.x, -uMouseVelocity.y, 0.0));
        
        // Calculate how aligned this vertex is with the mouse direction
        float alignment = dot(normalize(_position), mouseDir3D);
        
        // Vertices aligned with mouse direction get pushed away (negative displacement)
        // Use smoothstep for organic falloff
        float pushStrength = smoothstep(-0.3, 0.8, alignment);
        
        // Displacement magnitude based on velocity
        float velocityMagnitude = length(uMouseVelocity);
        
        // Push vertices away from the mouse direction
        displacedPosition -= normalize(_position) * pushStrength * velocityMagnitude * 0.15;
    }
    
    // Fourth layer: click ripple (travels from bottom -1 to top +1)
    if (uRipple > 0.0) {
        // Ripple wave position (-1 to 1, traveling upward)
        float ripplePos = -1.0 + uRipple * 2.5; // Slightly overshoot to complete the sweep
        
        // Distance from current y position to the ripple wave
        float distToRipple = abs(_position.y - ripplePos);
        
        // Ripple intensity (strongest at wave front, fades with distance)
        float rippleWidth = 0.4;
        float rippleIntensity = smoothstep(rippleWidth, 0.0, distToRipple) * (1.0 - uRipple * 0.7);
        
        // Add extra displacement at the ripple (reduced for subtlety)
        displacedPosition += normalize(_position) * rippleIntensity * 0.08;
    }

    return displacedPosition;
}

// Helper to get gradient noises (consolidates duplicate calculations)
vec2 getGradientNoises(vec3 pos, float time) {
    return vec2(
        perlin4d(vec4(pos * 1.8, time * 1.2)),
        perlin4d(vec4(pos * 2.3, time * 0.8))
    );
}

void main() {
    // Position
    vec3 displacedPosition = getDisplacedPosition(position);
    vec4 viewPosition = viewMatrix * vec4(displacedPosition, 1.0);
    gl_Position = projectionMatrix * viewPosition;

    // Optimized normal computation using approximation instead of recalculating neighbors
    // This is ~66% faster and visually identical for smooth organic shapes
    vec3 displacement = displacedPosition - position;
    vec3 computedNormal = normalize(normal + displacement * 0.5);

    // Lighting for subtle shading
    float lightAIntensity = max(0.0, -dot(computedNormal, normalize(-uLightAPosition))) * uLightAIntensity;
    float lightBIntensity = max(0.0, -dot(computedNormal, normalize(-uLightBPosition))) * uLightBIntensity;

    // Use position + noise to create flowing gradient across entire surface
    vec2 gradientNoises = getGradientNoises(position, uTime);
    
    // Create gradient based on position (normalized -1 to 1 range mapped to 0-1)
    float gradientPos = (position.y + 1.0) * 0.5 + gradientNoises.x * 0.4;
    gradientPos = clamp(gradientPos, 0.0, 1.0);
    
    // Secondary gradient for horizontal variation (independent noise)
    float horizGradient = (position.x + 1.0) * 0.5 + gradientNoises.y * 0.35;
    horizGradient = clamp(horizGradient, 0.0, 1.0);
    
    // Blend between the two light colors based on gradient position
    vec3 baseColor = mix(uLightAColor, uLightBColor, gradientPos);
    
    // Add horizontal color variation
    baseColor = mix(baseColor, mix(uLightBColor, uLightAColor, 0.5), horizGradient * 0.3);
    
    // Add subtle lighting shading for depth
    float shading = 0.7 + lightAIntensity * 0.15 + lightBIntensity * 0.15;
    baseColor *= shading;
    
    // Fresnel highlights at edges
    vec3 viewDirection = normalize(displacedPosition - cameraPosition);
    float fresnel = pow(1.0 - abs(dot(viewDirection, computedNormal)), 2.0);
    baseColor = mix(baseColor, vec3(1.0), fresnel * 0.25);

    vColor = baseColor;
}
`;

const fragmentShader = `
varying vec3 vColor;

void main() {
    gl_FragColor = vec4(vColor, 1.0);
}
`;

type OrbState = 'idle' | 'social-x' | 'social-github' | 'email' | 'work' | 'location';

interface OrbMeshProps {
    orbState: OrbState;
    mousePosition: { x: number; y: number };
    clickTime?: number;
}

const getStateColors = (state: OrbState): { lightA: THREE.Color; lightB: THREE.Color } => {
    switch (state) {
        case 'social-x':
            return { lightA: new THREE.Color('#1DA1F2'), lightB: new THREE.Color('#0088cc') };
        case 'social-github':
            return { lightA: new THREE.Color('#8b5cf6'), lightB: new THREE.Color('#6e5494') };
        case 'email':
            return { lightA: new THREE.Color('#5DD5C3'), lightB: new THREE.Color('#3b9e8c') };
        case 'work':
            return { lightA: new THREE.Color('#ff7e5f'), lightB: new THREE.Color('#feb47b') };
        case 'location':
            return { lightA: new THREE.Color('#22c55e'), lightB: new THREE.Color('#16a34a') };
        default:
            // Teal to blue gradient for contrast
            return { lightA: new THREE.Color('#A5F3E8'), lightB: new THREE.Color('#7DD3FC') };
    }
};

// Store uniforms outside component to persist across renders
const createUniforms = () => ({
    // Teal to blue gradient for contrast
    uLightAColor: { value: new THREE.Color('#A5F3E8') },  // Light teal
    uLightAPosition: { value: new THREE.Vector3(1, 1, 0) },
    uLightAIntensity: { value: 1.8 },
    uLightBColor: { value: new THREE.Color('#7DD3FC') },  // Soft blue
    uLightBPosition: { value: new THREE.Vector3(-1, -1, 0) },
    uLightBIntensity: { value: 1.4 },
    uDistortionFrequency: { value: 1.0 },      // Reduced from 1.5
    uDistortionStrength: { value: 0.2 },       // Reduced from 0.65
    uDisplacementFrequency: { value: 1.5 },    // Reduced from 2.1
    uDisplacementStrength: { value: 0.08 },    // Reduced from 0.15
    uFresnelOffset: { value: -1.6 },
    uFresnelMultiplier: { value: 3.5 },
    uFresnelPower: { value: 1.8 },
    uTime: { value: 0 },
    uRipple: { value: 0 },
    uMouseVelocity: { value: new THREE.Vector2(0, 0) },
});

function OrbMeshInner({ orbState, mousePosition, clickTime = 0 }: OrbMeshProps) {
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const uniformsRef = useRef(createUniforms());
    const lastMouseRef = useRef({ x: 50, y: 50 });
    const mouseVelocityRef = useRef(0);
    const lastClickTimeRef = useRef(0);
    const rippleStartRef = useRef(0);

    useFrame((state) => {
        if (!materialRef.current) return;

        // Animate time
        materialRef.current.uniforms.uTime.value = state.clock.elapsedTime * 0.3;

        // === CLICK RIPPLE ANIMATION ===
        // Detect new click
        if (clickTime > lastClickTimeRef.current) {
            lastClickTimeRef.current = clickTime;
            rippleStartRef.current = state.clock.elapsedTime;
        }

        // Animate ripple (0 to 1 over ~800ms)
        const rippleDuration = 0.8; // seconds
        const rippleElapsed = state.clock.elapsedTime - rippleStartRef.current;
        const rippleProgress = Math.min(rippleElapsed / rippleDuration, 1.0);

        // Ease out the ripple for a nice finish
        const easedRipple = rippleProgress < 1.0 ? Math.pow(rippleProgress, 0.6) : 0;
        materialRef.current.uniforms.uRipple.value = easedRipple;

        // Calculate mouse velocity from passed mousePosition (global window tracking)
        const dx = mousePosition.x - lastMouseRef.current.x;
        const dy = mousePosition.y - lastMouseRef.current.y;
        const velocity = Math.sqrt(dx * dx + dy * dy);
        lastMouseRef.current = { x: mousePosition.x, y: mousePosition.y };

        // Smooth the velocity with easing (different easing rates for variety)
        mouseVelocityRef.current += (velocity - mouseVelocityRef.current) * 0.08;
        const v = mouseVelocityRef.current;

        // Update mouse velocity direction for shader (normalized and smoothed)
        const velocityVector = new THREE.Vector2(dx, dy);
        if (velocityVector.length() > 0.01) {
            velocityVector.normalize().multiplyScalar(v * 0.5); // Scale by velocity magnitude
        }
        if (materialRef.current.uniforms.uMouseVelocity) {
            materialRef.current.uniforms.uMouseVelocity.value.lerp(velocityVector, 0.15);
        }

        // === ORGANIC MULTI-PARAMETER REACTIVITY ===
        // Consolidated velocity-based parameter updates
        const uniforms = materialRef.current.uniforms;

        // Displacement parameters (main morphing effect)
        uniforms.uDisplacementStrength.value = Math.min(v * 0.04, 0.18);
        uniforms.uDisplacementFrequency.value = 1.5 + Math.min(v * 0.06, 0.8);

        // Distortion parameters (warps noise sampling)
        uniforms.uDistortionStrength.value = 0.2 + Math.min(v * 0.06, 0.25);
        uniforms.uDistortionFrequency.value = 1.0 + Math.min(v * 0.03, 0.4);

        // Light intensity (gets brighter with movement)
        const lightBoost = Math.min(v * 0.02, 0.4);
        uniforms.uLightAIntensity.value = 1.8 + lightBoost;
        uniforms.uLightBIntensity.value = 1.4 + lightBoost * 0.8;

        // Animation speed boost
        uniforms.uTime.value = state.clock.elapsedTime * (0.3 + Math.min(v * 0.01, 0.15));

        // Smoothly transition colors based on state
        const targetColors = getStateColors(orbState);
        materialRef.current.uniforms.uLightAColor.value.lerp(targetColors.lightA, 0.05);
        materialRef.current.uniforms.uLightBColor.value.lerp(targetColors.lightB, 0.05);

        // Light positions - movement influenced by mouse velocity
        const t = state.clock.elapsedTime * 0.2;
        const wiggle = v * 0.01;
        uniforms.uLightAPosition.value.set(
            Math.sin(t) * 0.5 + 1 + Math.sin(t * 3) * wiggle,
            Math.cos(t * 0.7) * 0.3 + 1 + Math.cos(t * 2.5) * wiggle,
            Math.sin(t * 0.3) * 0.3
        );
        uniforms.uLightBPosition.value.set(
            Math.cos(t * 0.8) * 0.5 - 1 + Math.cos(t * 2.7) * wiggle,
            Math.sin(t * 0.6) * 0.3 - 1 + Math.sin(t * 3.1) * wiggle,
            Math.cos(t * 0.4) * 0.3
        );
    });

    return (
        <mesh>
            <sphereGeometry args={[1, 64, 64]} />
            <shaderMaterial
                ref={materialRef}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniformsRef.current}
            />
        </mesh>
    );
}

// Memoize the entire component
import { memo } from "react";
export default memo(OrbMeshInner);
