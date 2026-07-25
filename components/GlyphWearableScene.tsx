"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

type NumericRef = { current: number };

type GlyphSceneProps = {
  assembly: NumericRef;
  density: number;
  mobile: boolean;
  progress: NumericRef;
  reduced: boolean;
  visible: boolean;
};

const glyphs = [
  "A", "B", "R", "G", "T", "X", "a", "e", "i", "o", "r", "t", "0", "1", "4", "7",
  "8", "9", "#", "+", "/", ":", "[", "]", "{", "}", "-", ".", "x", "y", "O", "C",
  "R", "T", "I", "M", "G", "C", "F", "N", "0", ".", "9", "4", "0", ".", "8", "6",
  "0", ".", "7", "1", "|", "_", "=", ">", "<", "?", "!", ";", "P", "S", "V", "A",
];

const vertexShader = /* glsl */ `
  attribute vec3 aScatter;
  attribute vec3 aRecognition;
  attribute vec3 aWave;
  attribute float aGlyph;
  attribute float aSize;
  attribute float aSeed;
  attribute float aKind;
  attribute float aRole;
  uniform float uAssembly;
  uniform float uStage;
  uniform float uTime;
  uniform float uPixelRatio;
  varying float vGlyph;
  varying float vOpacity;
  varying vec3 vColor;

  float ease(float value) {
    return value * value * (3.0 - 2.0 * value);
  }

  void main() {
    float assembled = ease(clamp(uAssembly, 0.0, 1.0));
    vec3 positionValue = mix(aScatter, position, assembled);
    float recognition = smoothstep(4.65, 5.35, uStage) * (1.0 - smoothstep(7.15, 7.85, uStage));
    float speech = smoothstep(6.8, 7.35, uStage) * (1.0 - smoothstep(7.75, 8.0, uStage));
    float completion = smoothstep(7.7, 8.0, uStage);

    if (aKind < 0.5) {
      positionValue = mix(positionValue, aRecognition, recognition);
      positionValue = mix(positionValue, aWave, speech);
      positionValue = mix(positionValue, position, completion);
    } else if (aKind < 1.5) {
      positionValue = position;
    } else {
      positionValue = mix(aRecognition, aWave, speech);
    }

    float restrainedMotion = sin(uTime * 0.42 + aSeed * 13.0) * 0.012;
    positionValue.z += restrainedMotion * assembled * (1.0 - completion);

    float pageVisible = smoothstep(2.65, 3.25, uStage) * (1.0 - smoothstep(6.45, 7.1, uStage));
    pageVisible = max(pageVisible, completion * 0.82);
    float flowVisible = smoothstep(3.0, 3.7, uStage) * (1.0 - smoothstep(7.8, 8.0, uStage));
    flowVisible = max(flowVisible, completion * 0.72);

    vOpacity = mix(0.32, 1.0, assembled) * (0.55 + aSeed * 0.42);
    if (aKind > 0.5 && aKind < 1.5) vOpacity *= pageVisible;
    if (aKind > 1.5) vOpacity *= flowVisible;

    vec3 ink = vec3(0.043, 0.043, 0.059);
    vec3 graphite = vec3(0.30, 0.29, 0.32);
    vec3 blue = vec3(0.157, 0.333, 0.906);
    vec3 purple = vec3(0.396, 0.278, 0.910);
    vColor = mix(graphite, ink, 0.45 + aSeed * 0.55);

    float cameraFocus = smoothstep(1.65, 2.25, uStage) * (1.0 - smoothstep(4.8, 5.4, uStage));
    if (aRole > 1.5 && aRole < 2.5) vColor = mix(vColor, blue, cameraFocus);
    if (aKind > 0.5 && uStage > 2.4) vColor = mix(vColor, blue, 0.72);
    if (uStage > 4.65 && uStage < 7.75 && (aRole > 2.5 || aKind > 1.5)) vColor = mix(vColor, purple, 0.82);
    if (completion > 0.0 && aRole > 1.5 && aRole < 2.5) vColor = mix(vColor, blue, 0.7);

    vec4 modelPosition = modelMatrix * vec4(positionValue, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = aSize * uPixelRatio * (6.2 / max(1.0, -viewPosition.z));
    vGlyph = aGlyph;
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uAtlas;
  varying float vGlyph;
  varying float vOpacity;
  varying vec3 vColor;

  void main() {
    vec2 cell = vec2(mod(vGlyph, 8.0), floor(vGlyph / 8.0));
    vec2 local = vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y);
    vec2 atlasUv = (cell + local) / 8.0;
    float alpha = texture2D(uAtlas, atlasUv).a;
    if (alpha < 0.08 || vOpacity < 0.01) discard;
    gl_FragColor = vec4(vColor, alpha * vOpacity);
  }
`;

function makeGlyphAtlas() {
  const cell = 64;
  const canvas = document.createElement("canvas");
  canvas.width = cell * 8;
  canvas.height = cell * 8;
  const context = canvas.getContext("2d");
  if (!context) return new THREE.Texture();
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#fff";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = '600 38px "IBM Plex Mono", monospace';
  glyphs.forEach((glyph, index) => {
    const column = index % 8;
    const row = Math.floor(index / 8);
    context.fillText(glyph, column * cell + cell / 2, row * cell + cell / 2 + 2);
  });
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function mulberry32(seed: number) {
  return () => {
    let value = seed += 0x6d2b79f5;
    value = Math.imul(value ^ value >>> 15, value | 1);
    value ^= value + Math.imul(value ^ value >>> 7, value | 61);
    return ((value ^ value >>> 14) >>> 0) / 4294967296;
  };
}

function linePoint(random: () => number, start: THREE.Vector3, end: THREE.Vector3, spread = 0.045) {
  const t = random();
  return start.clone().lerp(end, t).add(new THREE.Vector3(
    (random() - 0.5) * spread,
    (random() - 0.5) * spread,
    (random() - 0.5) * spread,
  ));
}

function lensPoint(random: () => number, side: number) {
  const angle = random() * Math.PI * 2;
  const tube = (random() - 0.5) * 0.11;
  const xCurve = Math.sign(Math.cos(angle)) * Math.pow(Math.abs(Math.cos(angle)), 0.62);
  const yCurve = Math.sign(Math.sin(angle)) * Math.pow(Math.abs(Math.sin(angle)), 0.7);
  return new THREE.Vector3(
    side * 1.08 + xCurve * (0.96 + tube),
    0.1 + yCurve * (0.62 + tube),
    (random() - 0.5) * 0.2,
  );
}

function cameraPoint(random: () => number) {
  const face = Math.floor(random() * 3);
  const x = 1.87 + (random() - 0.5) * 0.28;
  const y = 0.5 + (random() - 0.5) * 0.28;
  const z = 0.13 + (random() - 0.5) * 0.2;
  if (face === 0) return new THREE.Vector3(1.87 + (random() > 0.5 ? 0.14 : -0.14), y, z);
  if (face === 1) return new THREE.Vector3(x, 0.5 + (random() > 0.5 ? 0.14 : -0.14), z);
  return new THREE.Vector3(x, y, 0.13 + (random() > 0.5 ? 0.1 : -0.1));
}

function pagePoint(random: () => number, border: boolean) {
  const center = new THREE.Vector3(-2.52, -0.02, 1.05);
  if (border) {
    const edge = Math.floor(random() * 4);
    const t = random();
    if (edge === 0) return center.clone().add(new THREE.Vector3(-0.72 + t * 1.44, 0.92, 0));
    if (edge === 1) return center.clone().add(new THREE.Vector3(0.72, 0.92 - t * 1.84, 0));
    if (edge === 2) return center.clone().add(new THREE.Vector3(0.72 - t * 1.44, -0.92, 0));
    return center.clone().add(new THREE.Vector3(-0.72, -0.92 + t * 1.84, 0));
  }
  const row = Math.floor(random() * 8);
  const rowWidth = 0.42 + random() * 0.48;
  return center.clone().add(new THREE.Vector3(
    -0.5 + random() * rowWidth * 1.1,
    0.58 - row * 0.15 + (random() - 0.5) * 0.025,
    (random() - 0.5) * 0.025,
  ));
}

function buildGeometry(count: number) {
  const random = mulberry32(8142026);
  const positions = new Float32Array(count * 3);
  const scatters = new Float32Array(count * 3);
  const recognition = new Float32Array(count * 3);
  const waves = new Float32Array(count * 3);
  const glyph = new Float32Array(count);
  const size = new Float32Array(count);
  const seed = new Float32Array(count);
  const kind = new Float32Array(count);
  const role = new Float32Array(count);

  for (let index = 0; index < count; index += 1) {
    const distribution = index / count;
    let target = new THREE.Vector3();
    let pointKind = 0;
    let pointRole = 0;

    if (distribution < 0.82) {
      const component = random();
      if (component < 0.59) target = lensPoint(random, random() > 0.5 ? 1 : -1);
      else if (component < 0.65) target = linePoint(random, new THREE.Vector3(-0.27, 0.29, 0), new THREE.Vector3(0.27, 0.29, 0), 0.09);
      else if (component < 0.82) {
        const side = random() > 0.5 ? 1 : -1;
        target = linePoint(random, new THREE.Vector3(side * 1.97, 0.34, -0.02), new THREE.Vector3(side * 3.15, 0.12, -1.62), 0.12);
        pointRole = 1;
      } else if (component < 0.92) {
        target = cameraPoint(random);
        pointRole = 2;
      } else if (component < 0.97) {
        target = linePoint(random, new THREE.Vector3(-1.94, 0.35, -0.04), new THREE.Vector3(-2.45, 0.27, -0.68), 0.18);
        pointRole = 3;
      } else {
        const side = random() > 0.5 ? 1 : -1;
        const angle = random() * Math.PI * 2;
        const radius = Math.sqrt(random());
        target = new THREE.Vector3(side * 1.08 + Math.cos(angle) * 0.76 * radius, 0.1 + Math.sin(angle) * 0.45 * radius, (random() - 0.5) * 0.08);
        pointRole = 4;
      }
    } else if (distribution < 0.97) {
      const border = random() < 0.34;
      target = pagePoint(random, border);
      pointKind = 1;
      pointRole = border ? 5 : 6;
    } else {
      target = new THREE.Vector3(-1.65 + random() * 3.1, -0.7 + random() * 1.4, 0.55 + (random() - 0.5) * 0.25);
      pointKind = 2;
      pointRole = 7;
    }

    const scatterDirection = new THREE.Vector3(random() - 0.5, random() - 0.5, random() - 0.5).normalize();
    const scatter = target.clone().add(scatterDirection.multiplyScalar(0.7 + random() * 2.8));
    const streamRow = Math.floor(random() * 7);
    const recognitionPosition = new THREE.Vector3(
      -1.85 + random() * 3.9,
      0.66 - streamRow * 0.22 + (random() - 0.5) * 0.05,
      (random() - 0.5) * 0.34,
    );
    const column = index % 72;
    const waveAmplitude = 0.14 + Math.abs(Math.sin(column * 0.42)) * 0.72;
    const wavePosition = new THREE.Vector3(
      -2.25 + (column / 71) * 4.5,
      (random() - 0.5) * waveAmplitude,
      (random() - 0.5) * 0.12,
    );

    target.toArray(positions, index * 3);
    scatter.toArray(scatters, index * 3);
    recognitionPosition.toArray(recognition, index * 3);
    wavePosition.toArray(waves, index * 3);
    glyph[index] = Math.floor(random() * 64);
    size[index] = pointKind === 2 ? 14 + random() * 9 : 11 + random() * 9;
    seed[index] = random();
    kind[index] = pointKind;
    role[index] = pointRole;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aScatter", new THREE.BufferAttribute(scatters, 3));
  geometry.setAttribute("aRecognition", new THREE.BufferAttribute(recognition, 3));
  geometry.setAttribute("aWave", new THREE.BufferAttribute(waves, 3));
  geometry.setAttribute("aGlyph", new THREE.BufferAttribute(glyph, 1));
  geometry.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
  geometry.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
  geometry.setAttribute("aKind", new THREE.BufferAttribute(kind, 1));
  geometry.setAttribute("aRole", new THREE.BufferAttribute(role, 1));
  geometry.computeBoundingSphere();
  return geometry;
}

function GlyphCloud({ assembly, density, mobile, progress, reduced }: Omit<GlyphSceneProps, "visible">) {
  const points = useRef<THREE.Points>(null);
  const geometry = useMemo(() => buildGeometry(density), [density]);
  const atlas = useMemo(() => makeGlyphAtlas(), []);
  const material = useMemo(() => new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    depthTest: true,
    vertexShader,
    fragmentShader,
    uniforms: {
      uAssembly: { value: reduced ? 1 : 0 },
      uStage: { value: reduced ? 8 : 0 },
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 1.5) },
      uAtlas: { value: atlas },
    },
  }), [atlas, reduced]);

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => atlas.dispose(), [atlas]);
  useEffect(() => () => material.dispose(), [material]);

  /* R3F's render loop intentionally mutates Three.js uniforms and object transforms. */
  /* eslint-disable react-hooks/immutability */
  useFrame((state, delta) => {
    material.uniforms.uAssembly.value = reduced ? 1 : assembly.current;
    const stage = reduced ? 8 : progress.current;
    material.uniforms.uStage.value = stage;
    material.uniforms.uTime.value += Math.min(delta, 0.04);
    if (!points.current) return;
    const rotateStage = THREE.MathUtils.smoothstep(stage, 0.6, 1.8);
    const finalStage = THREE.MathUtils.smoothstep(stage, 7.4, 8);
    const pointerX = reduced || mobile ? 0 : state.pointer.x * 0.035;
    const pointerY = reduced || mobile ? 0 : state.pointer.y * 0.018;
    const targetY = 0.1 + rotateStage * 0.43 - finalStage * 0.31 + pointerX;
    points.current.rotation.y = THREE.MathUtils.damp(points.current.rotation.y, targetY, 4.2, delta);
    points.current.rotation.x = THREE.MathUtils.damp(points.current.rotation.x, -0.03 - pointerY, 4.2, delta);
  });
  /* eslint-enable react-hooks/immutability */

  return <points ref={points} geometry={geometry} material={material} frustumCulled={false} />;
}

export default function GlyphWearableScene(props: GlyphSceneProps) {
  return <Canvas
    camera={{ fov: 42, near: 0.1, far: 40, position: [0, 0.05, 8.2] }}
    dpr={[1, 1.5]}
    frameloop={props.visible ? "always" : "never"}
    gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
  >
    <GlyphCloud assembly={props.assembly} density={props.density} mobile={props.mobile} progress={props.progress} reduced={props.reduced} />
  </Canvas>;
}
