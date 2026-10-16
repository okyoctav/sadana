"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const testCanvas = document.createElement("canvas");
      const gl = testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl");
      if (!gl) return;
    } catch {
      return;
    }

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030712, 0.0018);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.2, 5.5);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // 4. Main Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // A. Outer Particle Sphere (Digital Globe Matrix)
    const particleCount = 2200;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const radius = 2.0;

    const colorCyan = new THREE.Color(0x00d2ff);
    const colorTeal = new THREE.Color(0x00f5a0);
    const colorIndigo = new THREE.Color(0x3b82f6);
    const colorAlert = new THREE.Color(0xf59e0b);

    // Generate points distributed over sphere (Fibonacci sphere algorithm for even distribution)
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden ratio angle

    for (let i = 0; i < particleCount; i++) {
      const y = 1 - (i / (particleCount - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y); // radius at y
      const theta = phi * i;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      // Add subtle turbulence
      const noise = 1 + (Math.sin(x * 6) + Math.cos(y * 6)) * 0.015;

      positions[i * 3] = x * radius * noise;
      positions[i * 3 + 1] = y * radius * noise;
      positions[i * 3 + 2] = z * radius * noise;

      // Color variation (mostly cyan/teal/blue, with occasional alert amber for disaster monitoring theme)
      const mixedColor = colorIndigo.clone();
      if (i % 7 === 0) {
        mixedColor.copy(colorAlert);
      } else if (i % 2 === 0) {
        mixedColor.lerp(colorCyan, 0.8);
      } else {
        mixedColor.lerp(colorTeal, 0.7);
      }

      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Particle Material using smooth circular point texture
    const canvasTexture = document.createElement("canvas");
    canvasTexture.width = 32;
    canvasTexture.height = 32;
    const ctx = canvasTexture.getContext("2d");
    if (ctx) {
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, "rgba(255, 255, 255, 1)");
      grad.addColorStop(0.3, "rgba(255, 255, 255, 0.8)");
      grad.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 32, 32);
    }
    const pointTexture = new THREE.CanvasTexture(canvasTexture);

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      map: pointTexture,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    globeGroup.add(particles);

    // B. Inner Glowing Wireframe Core
    const coreGeometry = new THREE.IcosahedronGeometry(radius * 0.95, 3);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0x0066cc,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    globeGroup.add(coreMesh);

    // C. Glowing Atmosphere / Halo
    const atmosphereGeometry = new THREE.SphereGeometry(radius * 1.02, 32, 32);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x0099ff,
      transparent: true,
      opacity: 0.05,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    globeGroup.add(atmosphereMesh);

    // D. Geospatial Orbit Rings (Equatorial and Tilted Coordinate Rings)
    const ringsGroup = new THREE.Group();
    globeGroup.add(ringsGroup);

    const createRing = (r: number, colorHex: number, opacity: number, rotX: number, rotY: number) => {
      const ringGeom = new THREE.RingGeometry(r, r + 0.015, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: opacity,
        blending: THREE.AdditiveBlending,
      });
      const ringMesh = new THREE.Mesh(ringGeom, ringMat);
      ringMesh.rotation.x = rotX;
      ringMesh.rotation.y = rotY;
      return ringMesh;
    };

    const ring1 = createRing(radius * 1.25, 0x00e5ff, 0.4, Math.PI / 2.3, 0.2);
    const ring2 = createRing(radius * 1.4, 0x3b82f6, 0.25, Math.PI / 1.7, -0.4);
    ringsGroup.add(ring1);
    ringsGroup.add(ring2);

    // E. Glowing Hazard / Data Nodes around Indonesia / Globe coordinates
    const nodesGroup = new THREE.Group();
    globeGroup.add(nodesGroup);

    const nodeCoordinates = [
      { lat: -0.7893, lon: 113.9213, name: "Nusantara / Indonesia" }, // Indonesia center
      { lat: -6.2088, lon: 106.8456, name: "Jakarta" },
      { lat: 3.5952, lon: 98.6722, name: "Sumatera" },
      { lat: -5.1477, lon: 119.4327, name: "Sulawesi" },
      { lat: -2.5337, lon: 140.7181, name: "Papua" },
      { lat: -8.4095, lon: 115.1889, name: "Bali & Nusa Tenggara" },
    ];

    const nodeMeshes: THREE.Mesh[] = [];
    nodeCoordinates.forEach((coord, idx) => {
      const phi = (90 - coord.lat) * (Math.PI / 180);
      const theta = (coord.lon + 180) * (Math.PI / 180);

      const nx = -(radius * 1.02 * Math.sin(phi) * Math.cos(theta));
      const ny = radius * 1.02 * Math.cos(phi);
      const nz = radius * 1.02 * Math.sin(phi) * Math.sin(theta);

      // Node point
      const nodeGeom = new THREE.SphereGeometry(0.04, 16, 16);
      const nodeMat = new THREE.MeshBasicMaterial({
        color: idx === 0 ? 0xf59e0b : 0x00f5a0,
        blending: THREE.AdditiveBlending,
      });
      const nodeMesh = new THREE.Mesh(nodeGeom, nodeMat);
      nodeMesh.position.set(nx, ny, nz);
      nodesGroup.add(nodeMesh);
      nodeMeshes.push(nodeMesh);

      // Node pulse ring
      const ringGeom = new THREE.RingGeometry(0.05, 0.08, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: idx === 0 ? 0xf59e0b : 0x00f5a0,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.position.set(nx, ny, nz);
      ring.lookAt(0, 0, 0);
      nodesGroup.add(ring);
    });

    // F. Deep Space Ambient Stars
    const starCount = 600;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 35;
      starPositions[i + 1] = (Math.random() - 0.5) * 35;
      starPositions[i + 2] = (Math.random() - 0.5) * 35;
    }

    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({
      size: 0.03,
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.45,
      map: pointTexture,
      blending: THREE.AdditiveBlending,
    });
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // Initial globe tilt
    globeGroup.rotation.x = 0.25;
    globeGroup.position.x = 0; // centered, responsive adjustments in loop
    globeGroup.position.y = -0.1;

    // 5. Interactive Mouse & Gyro
    let targetX = 0;
    let targetY = 0;
    let mouseX = 0;
    let mouseY = 0;
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      mouseX = (clientX - halfW) / halfW;
      mouseY = (clientY - halfH) / halfH;

      if (isDragging) {
        const deltaX = clientX - prevMouseX;
        const deltaY = clientY - prevMouseY;
        globeGroup.rotation.y += deltaX * 0.005;
        globeGroup.rotation.x += deltaY * 0.005;
        prevMouseX = clientX;
        prevMouseY = clientY;
      }
    };

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      prevMouseX = "touches" in e ? e.touches[0].clientX : e.clientX;
      prevMouseY = "touches" in e ? e.touches[0].clientY : e.clientY;
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("mouseup", handlePointerUp);
    window.addEventListener("touchmove", handlePointerMove, { passive: true });
    window.addEventListener("touchstart", handlePointerDown, { passive: true });
    window.addEventListener("touchend", handlePointerUp);

    // 6. Responsive resize handler
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;

      camera.aspect = width / height;

      // Adjust camera distance for mobile screens
      if (width < 640) {
        camera.position.z = 6.8;
        camera.position.y = 0.8;
      } else if (width < 1024) {
        camera.position.z = 6.0;
        camera.position.y = 1.0;
      } else {
        camera.position.z = 5.2;
        camera.position.y = 0.9;
      }

      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // 7. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse follow parallax
      targetX = mouseX * 0.3;
      targetY = mouseY * 0.2;

      if (!isDragging) {
        // Continuous auto rotation
        globeGroup.rotation.y += 0.0025;
        globeGroup.rotation.x += (targetY - globeGroup.rotation.x + 0.25) * 0.02;
        globeGroup.position.x += (targetX * 0.3 - globeGroup.position.x) * 0.03;
      }

      // Counter-rotate rings
      ring1.rotation.z += 0.004;
      ring2.rotation.z -= 0.003;

      // Core subtle breathing pulse
      const pulse = 0.95 + Math.sin(elapsedTime * 2) * 0.02;
      coreMesh.scale.set(pulse, pulse, pulse);

      // Starfield slow drift
      starField.rotation.y = elapsedTime * 0.0005;

      // Node subtle blinking
      nodeMeshes.forEach((mesh, idx) => {
        const s = 1 + Math.sin(elapsedTime * 4 + idx) * 0.25;
        mesh.scale.set(s, s, s);
      });

      renderer.render(scene, camera);
    };

    animate();

    // 8. Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("mouseup", handlePointerUp);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("touchstart", handlePointerDown);
      window.removeEventListener("touchend", handlePointerUp);
      window.removeEventListener("resize", handleResize);

      // Dispose Three.js objects
      particleGeometry.dispose();
      particleMaterial.dispose();
      pointTexture.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      atmosphereGeometry.dispose();
      atmosphereMaterial.dispose();
      starGeometry.dispose();
      starMaterial.dispose();

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-auto z-0 overflow-hidden select-none"
      style={{ touchAction: "none" }}
      aria-hidden="true"
    />
  );
}
