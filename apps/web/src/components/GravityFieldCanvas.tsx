"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFieldStore } from "@/lib/motion/fieldStore";
import { usePrefersReducedMotion } from "@/lib/motion/reducedMotion";

function Field() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const pointer = useFieldStore((s) => s.pointer);
  const energy = useFieldStore((s) => s.energy);
  const prefersReducedMotion = usePrefersReducedMotion();

  const shader = useMemo(() => {
    const uniforms = {
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uEnergy: { value: 0 }
    };

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      precision highp float;
      varying vec2 vUv;
      uniform float uTime;
      uniform vec2 uPointer;
      uniform float uEnergy;

      float hash(vec2 p){
        p = fract(p*vec2(123.34, 456.21));
        p += dot(p, p+45.32);
        return fract(p.x*p.y);
      }

      float noise(vec2 p){
        vec2 i = floor(p);
        vec2 f = fract(p);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        vec2 u = f*f*(3.0-2.0*f);
        return mix(a, b, u.x) + (c-a)*u.y*(1.0-u.x) + (d-b)*u.x*u.y;
      }

      void main(){
        vec2 p = vUv;
        vec2 centered = p - 0.5;

        float t = uTime;
        float n = 0.0;
        n += 0.55 * noise(centered*3.0 + vec2(t*0.04, -t*0.03));
        n += 0.25 * noise(centered*7.0 + vec2(-t*0.06, t*0.05));
        n += 0.12 * noise(centered*15.0 + vec2(t*0.12, t*0.11));

        float distToPointer = distance(p, uPointer);
        float lens = smoothstep(0.6, 0.0, distToPointer);
        float glow = 0.10 * lens + 0.20 * uEnergy * lens;

        float base = 0.06 + 0.18 * n;
        float vignette = smoothstep(0.85, 0.2, length(centered));
        float value = (base + glow) * vignette;

        gl_FragColor = vec4(vec3(value), 1.0);
      }
    `;

    return { uniforms, vertexShader, fragmentShader };
  }, []);

  useFrame((_, delta) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uPointer.value.set(pointer.x, pointer.y);
    materialRef.current.uniforms.uEnergy.value = energy;
    if (!prefersReducedMotion) materialRef.current.uniforms.uTime.value += delta;
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={materialRef} args={[shader]} />
    </mesh>
  );
}

export function GravityFieldCanvas() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <Canvas
        dpr={prefersReducedMotion ? 1 : [1, 2]}
        gl={{ antialias: !prefersReducedMotion, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 1] }}
      >
        <Field />
      </Canvas>
    </div>
  );
}
