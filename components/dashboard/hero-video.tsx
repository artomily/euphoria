"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { cn } from "@/lib/utils";

interface HeroVideoProps {
  /** Path to the video, relative to /public. */
  src?: string;
  className?: string;
}

// Full-screen-quad shader: maps the video with a "cover" fit and applies a
// cursor-driven lens magnification + chromatic aberration + parallax drift.
const VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  uniform sampler2D uTexture;
  uniform vec2  uMouse;        // smoothed cursor, uv space (0..1)
  uniform vec2  uResolution;   // canvas size in px
  uniform float uVideoAspect;  // video width / height
  uniform float uHover;        // 0..1 eased presence of cursor
  uniform float uTime;

  varying vec2 vUv;

  // Re-map uv so the video fills the plane without stretching ("cover").
  vec2 coverUv(vec2 uv, float planeAspect, float videoAspect) {
    vec2 r = uv;
    if (planeAspect > videoAspect) {
      float s = videoAspect / planeAspect;
      r.y = (uv.y - 0.5) * s + 0.5;
    } else {
      float s = planeAspect / videoAspect;
      r.x = (uv.x - 0.5) * s + 0.5;
    }
    return r;
  }

  void main() {
    float planeAspect = uResolution.x / uResolution.y;
    vec2 uv = vUv;

    // Aspect-corrected vector from cursor so the lens stays circular.
    vec2 toM = uv - uMouse;
    toM.x *= planeAspect;
    float dist = length(toM);

    float radius = 0.38;
    float falloff = smoothstep(radius, 0.0, dist);

    // Pull pixels gently toward the cursor — a soft magnifying lens.
    float strength = uHover * 0.10;
    float lens = strength * falloff;
    vec2 dir = normalize(uv - uMouse + 1e-5);
    vec2 distorted = uv - dir * lens;

    // Whole image drifts opposite the cursor for a parallax feel.
    distorted += (uMouse - 0.5) * 0.018 * uHover;

    // Chromatic aberration grows near the cursor.
    float ca = 0.0025 + lens * 0.05;
    vec2 off = dir * ca;
    float r = texture2D(uTexture, coverUv(distorted + off, planeAspect, uVideoAspect)).r;
    float g = texture2D(uTexture, coverUv(distorted,       planeAspect, uVideoAspect)).g;
    float b = texture2D(uTexture, coverUv(distorted - off, planeAspect, uVideoAspect)).b;
    vec3 col = vec3(r, g, b);

    // A soft highlight that follows the cursor keeps it feeling "alive".
    col += uHover * falloff * 0.12;

    // Subtle vignette to anchor the frame.
    float vig = smoothstep(1.15, 0.35, length(uv - 0.5));
    col *= mix(0.82, 1.0, vig);

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function HeroVideo({ src = "/hero.mp4", className }: HeroVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // ── Video element (off-DOM, drives the texture) ──────────────────────────
    const video = document.createElement("video");
    video.src = src;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.autoplay = true;
    video.crossOrigin = "anonymous";
    video.play().catch(() => {
      /* autoplay can be blocked until interaction; texture updates on play */
    });

    // ── Renderer ─────────────────────────────────────────────────────────────
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      // WebGL unavailable — degrade to a plain looping video.
      video.style.width = "100%";
      video.style.height = "100%";
      video.style.objectFit = "cover";
      container.appendChild(video);
      return () => {
        video.pause();
        if (video.parentNode === container) container.removeChild(video);
      };
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const texture = new THREE.VideoTexture(video);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    const uniforms = {
      uTexture: { value: texture },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: {
        value: new THREE.Vector2(container.clientWidth, container.clientHeight),
      },
      uVideoAspect: { value: 16 / 9 },
      uHover: { value: 0 },
      uTime: { value: 0 },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    video.addEventListener("loadedmetadata", () => {
      if (video.videoHeight > 0) {
        uniforms.uVideoAspect.value = video.videoWidth / video.videoHeight;
      }
    });

    // ── Cursor tracking (targets are eased toward in the loop) ───────────────
    const targetMouse = new THREE.Vector2(0.5, 0.5);
    let targetHover = 0;

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      targetMouse.set(
        (e.clientX - rect.left) / rect.width,
        1 - (e.clientY - rect.top) / rect.height, // flip to uv space
      );
    };
    const onEnter = () => {
      targetHover = prefersReduced ? 0 : 1;
    };
    const onLeave = () => {
      targetHover = 0;
      targetMouse.set(0.5, 0.5);
    };

    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerenter", onEnter);
    container.addEventListener("pointerleave", onLeave);

    // ── Resize ───────────────────────────────────────────────────────────────
    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      uniforms.uResolution.value.set(w, h);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    // ── Render loop ──────────────────────────────────────────────────────────
    const clock = new THREE.Clock();
    renderer.setAnimationLoop(() => {
      uniforms.uMouse.value.lerp(targetMouse, 0.08);
      uniforms.uHover.value += (targetHover - uniforms.uHover.value) * 0.08;
      uniforms.uTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    });

    // ── Cleanup ──────────────────────────────────────────────────────────────
    return () => {
      renderer.setAnimationLoop(null);
      resizeObserver.disconnect();
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerenter", onEnter);
      container.removeEventListener("pointerleave", onLeave);
      video.pause();
      video.removeAttribute("src");
      video.load();
      mesh.geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [src]);

  return <div ref={containerRef} className={cn("w-full h-full", className)} aria-hidden />;
}
