uniform float uTime;
uniform vec2 uMouse;
uniform float uHoverIntensity;
uniform vec3 uStateColor;
uniform float uNoiseScale;
uniform float uFlowSpeed;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

// Perlin noise (imported from noise.glsl)
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

// Fresnel effect for edge glow
float fresnel(vec3 viewDir, vec3 normal, float power) {
    return pow(1.0 - max(dot(viewDir, normal), 0.0), power);
}

void main() {
    // 1. Base glassmorphic gradient (cyan to lavender to pink)
    vec3 color1 = vec3(0.48, 0.88, 0.91); // Cyan
    vec3 color2 = vec3(0.73, 0.72, 0.94); // Lavender
    vec3 color3 = vec3(1.0, 0.71, 0.76);  // Pink
    
    float gradientMix = vUv.y;
    vec3 baseColor = mix(color1, color2, smoothstep(0.0, 0.6, gradientMix));
    baseColor = mix(baseColor, color3, smoothstep(0.6, 1.0, gradientMix));
    
    // 2. Perlin noise for organic movement
    float noise1 = snoise(vUv * uNoiseScale + vec2(uTime * uFlowSpeed, 0.0));
    float noise2 = snoise(vUv * uNoiseScale * 1.5 + vec2(0.0, uTime * uFlowSpeed * 0.8));
    float combinedNoise = (noise1 + noise2) * 0.5;
    
    // 3. Flow field lines (inspired by reference image 1 & 3)
    float flowLines = sin(vUv.x * 30.0 + combinedNoise * 8.0 + uTime * 2.0);
    flowLines = smoothstep(0.3, 0.7, flowLines);
    flowLines *= smoothstep(0.2, 0.5, vUv.y) * smoothstep(0.8, 0.5, vUv.y); // Fade at edges
    
    // 4. Fresnel glow for glassmorphic effect
    vec3 viewDir = normalize(cameraPosition - vPosition);
    float fresnelTerm = fresnel(viewDir, vNormal, 2.5);
    
    // 5. State-based color mixing (hover interactions)
    vec3 finalColor = mix(baseColor, uStateColor, uHoverIntensity * 0.6);
    
    // 6. Add flow lines
    finalColor += vec3(flowLines) * 0.15;
    
    // 7. Add noise variation
    finalColor += combinedNoise * 0.08;
    
    // 8. Fresnel edge glow
    finalColor += fresnelTerm * vec3(1.0, 1.0, 1.0) * 0.4;
    
    // 9. Brighten on hover
    finalColor += uHoverIntensity * 0.15;
    
    // 10. Alpha for glassmorphic transparency
    float alpha = 0.75 + fresnelTerm * 0.25;
    
    gl_FragColor = vec4(finalColor, alpha);
}
