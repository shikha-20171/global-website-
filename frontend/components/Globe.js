"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * 3D ROTATING GLASSMORPHIC BLUE EARTH GLOBE
 * - Exact sapphire & royal blue palette matching the "Industries We Serve" cards:
 *   - Base Navy: #0e276b via #091e52 to #061438
 *   - Continents / Land: #1d4ed8 and #2563eb
 *   - City networks & Arcs: #60a5fa & #3b82f6
 *   - Atmospheric rim & Fresnel: #3b82f6
 * - ALL 6 KEY POINTS (SaaS, Enterprise, AI, Cloud, Security, Automation)
 *   CONTINUOUSLY ROTATE INSIDE THE GLOBE SIMULTANEOUSLY!
 * - ALL 6 ARE VISIBLE AT ALL TIMES with 3D depth, crisp pure white typography,
 *   and glassmorphic glowing blue badges.
 */
export default function Globe({ className = "" }) {
  const containerRef = useRef(null);
  const badgeRefs = useRef([]);

  const KEY_POINTS = [
    { name: "SaaS", iconColor: "#60a5fa" },
    { name: "Enterprise", iconColor: "#93c5fd" },
    { name: "AI", iconColor: "#60a5fa" },
    { name: "Cloud", iconColor: "#93c5fd" },
    { name: "Security", iconColor: "#60a5fa" },
    { name: "Automation", iconColor: "#93c5fd" },
  ];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || 640;
    let height = container.clientHeight || 640;

    // ─── 1. THREE.JS SCENE, CAMERA & RENDERER ───
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 2.80;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    renderer.domElement.style.cursor = "grab";
    container.appendChild(renderer.domElement);

    // Root rotating globe group
    const globeGroup = new THREE.Group();
    globeGroup.rotation.z = -0.26; // Gentle axial tilt
    globeGroup.rotation.x = 0.16;
    scene.add(globeGroup);

    // ─── 2. LOAD NASA NIGHTTIME EARTH TEXTURES ───
    const textureLoader = new THREE.TextureLoader();
    const lightsTexture = textureLoader.load("/textures/earth_lights_2048.png");
    const atmosTexture = textureLoader.load("/textures/earth_atmos_2048.jpg");

    lightsTexture.wrapS = THREE.RepeatWrapping;
    atmosTexture.wrapS = THREE.RepeatWrapping;

    // ─── 3. GLASSMORPHIC SPHERE SHADER MATCHING THE INDUSTRY CARDS BLUE ───
    const GLOBE_RADIUS = 0.88;
    const earthGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);

    const earthShader = {
      uniforms: {
        tLights: { value: lightsTexture },
        tAtmos: { value: atmosTexture },
        glowColor: { value: new THREE.Color("#3b82f6") }, // Card border blue
        cityBlue: { value: new THREE.Color("#60a5fa") },  // Card sky accent blue
        oceanColor: { value: new THREE.Color("#0e276b") },// Card deep sapphire navy
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vViewDir;

        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vViewDir = normalize(-mvPosition.xyz);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D tLights;
        uniform sampler2D tAtmos;
        uniform vec3 glowColor;
        uniform vec3 cityBlue;
        uniform vec3 oceanColor;

        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vViewDir;

        void main() {
          vec4 lights = texture2D(tLights, vUv);
          vec4 atmos = texture2D(tAtmos, vUv);

          // Deep sapphire navy ocean matching cards: #0e276b via #091e52 to #061438
          float landFactor = (atmos.r + atmos.g + atmos.b) / 3.0;
          vec3 oceanTop = vec3(0.055, 0.153, 0.420);  // #0e276b
          vec3 oceanMid = vec3(0.035, 0.118, 0.322);  // #091e52
          vec3 oceanDeep = vec3(0.024, 0.078, 0.220); // #061438
          vec3 baseOcean = mix(oceanDeep, oceanTop, clamp(vNormal.y * 0.5 + 0.5, 0.0, 1.0));

          // Illuminated royal blue continents: #1d4ed8 and #2563eb
          vec3 landDeep = vec3(0.114, 0.306, 0.847);   // #1d4ed8
          vec3 landBright = vec3(0.145, 0.388, 0.922); // #2563eb
          vec3 baseLand = mix(landDeep, landBright, clamp(landFactor * 1.5, 0.0, 1.0));
          vec3 surface = mix(baseOcean, baseLand, clamp(landFactor * 1.8, 0.0, 1.0));

          // Nighttime metropolitan lights in card sky blue #60a5fa & crisp white
          float lightIntensity = pow(lights.r, 1.15);
          vec3 cityColor = mix(cityBlue, vec3(0.96, 0.98, 1.0), lightIntensity * 0.7);
          vec3 cityEmissive = cityColor * lightIntensity * 4.6;

          // Atmospheric Fresnel rim glow matching card's #3b82f6 laser edge
          float fresnel = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), 3.0);
          vec3 rimGlow = glowColor * fresnel * 2.2;

          vec3 finalColor = surface + cityEmissive + rimGlow;
          // Glassmorphic translucent shell so internal key points shine through
          float alpha = 0.82 + fresnel * 0.18;
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
    };

    const earthMaterial = new THREE.ShaderMaterial({
      uniforms: earthShader.uniforms,
      vertexShader: earthShader.vertexShader,
      fragmentShader: earthShader.fragmentShader,
      transparent: true,
      depthWrite: false, // Allows inner rotating elements to shine through
    });

    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    globeGroup.add(earthMesh);

    // ─── 4. ROYAL BLUE ATMOSPHERIC HALO (#3b82f6) ───
    const atmosGeometry = new THREE.SphereGeometry(GLOBE_RADIUS * 1.045, 48, 48);
    const atmosMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewDir;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vViewDir = normalize(-mvPosition.xyz);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vViewDir;
        void main() {
          float d = dot(vNormal, vViewDir);
          float intensity = pow(1.0 - abs(d), 3.8);
          gl_FragColor = vec4(0.231, 0.510, 0.965, intensity * 0.85); // #3b82f6
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
    const atmosMesh = new THREE.Mesh(atmosGeometry, atmosMaterial);
    globeGroup.add(atmosMesh);

    // ─── 5. INNER ROTATING GROUP FOR 6 KEY POINTS ───
    const innerCoreGroup = new THREE.Group();
    globeGroup.add(innerCoreGroup);

    // ─── 6. 3D GLOBAL FLIGHT ARCS ON SURFACE ───
    function latLonToVector3(lat, lon, radius = GLOBE_RADIUS) {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      return new THREE.Vector3(
        -radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      );
    }

    const arcRoutes = [
      { from: [40.71, -74.0], to: [51.51, -0.13], color: "#60a5fa", alt: 0.28, speed: 0.0006 },
      { from: [40.71, -74.0], to: [-23.55, -46.63], color: "#3b82f6", alt: 0.26, speed: 0.0006 },
      { from: [-23.55, -46.63], to: [48.86, 2.35], color: "#2563eb", alt: 0.30, speed: 0.0005 },
      { from: [51.51, -0.13], to: [35.68, 139.77], color: "#93c5fd", alt: 0.36, speed: 0.00045 },
      { from: [25.2, 55.27], to: [1.35, 103.82], color: "#60a5fa", alt: 0.26, speed: 0.00065 },
      { from: [19.08, 72.88], to: [51.51, -0.13], color: "#2563eb", alt: 0.32, speed: 0.00055 },
      { from: [1.35, 103.82], to: [-33.87, 151.21], color: "#3b82f6", alt: 0.30, speed: 0.00055 },
      { from: [37.77, -122.42], to: [35.68, 139.77], color: "#60a5fa", alt: 0.34, speed: 0.00055 },
    ];

    const arcPulses = [];
    arcRoutes.forEach((route) => {
      const p1 = latLonToVector3(route.from[0], route.from[1], GLOBE_RADIUS);
      const p2 = latLonToVector3(route.to[0], route.to[1], GLOBE_RADIUS);
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      const dist = p1.distanceTo(p2);
      mid.normalize().multiplyScalar(GLOBE_RADIUS + dist * route.alt);

      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const points = curve.getPoints(32);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: new THREE.Color(route.color),
        transparent: true,
        opacity: 0.72,
      });

      globeGroup.add(new THREE.Line(geometry, material));

      const photonMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.015, 6, 6),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      globeGroup.add(photonMesh);

      arcPulses.push({ curve, mesh: photonMesh, speed: route.speed, progress: Math.random() });
    });

    // ─── 7. 3D LIGHT BEACONS FOR ALL 6 KEY POINTS INSIDE THE GLOBE ───
    const ORBIT_RADIUS = 0.60; // Firmly INSIDE the globe sphere (radius 0.88)
    const keyPointNodes = KEY_POINTS.map((kp, idx) => {
      const nodeGroup = new THREE.Group();
      innerCoreGroup.add(nodeGroup);

      // Glowing beacon inside the globe
      const beaconMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.024, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      const haloMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.048, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.8 })
      );
      nodeGroup.add(beaconMesh);
      nodeGroup.add(haloMesh);

      return { ...kp, index: idx, nodeGroup };
    });

    // ─── 8. INTERACTIVE DRAG TO ROTATE IN 3D ───
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let autoRotate = true;

    const onMouseDown = (e) => {
      isDragging = true;
      autoRotate = false;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      renderer.domElement.style.cursor = "grabbing";
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouseX;
      const dy = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      globeGroup.rotation.y += dx * 0.005;
      globeGroup.rotation.x += dy * 0.003;
    };

    const onMouseUp = () => {
      isDragging = false;
      autoRotate = true;
      renderer.domElement.style.cursor = "grab";
    };

    const dom = renderer.domElement;
    dom.addEventListener("pointerdown", onMouseDown);
    window.addEventListener("pointermove", onMouseMove);
    window.addEventListener("pointerup", onMouseUp);

    // ─── 9. CONTINUOUS ROTATION ANIMATION (ALL 6 POINTS ROTATE INSIDE) ───
    let raf;
    let orbitAngle = 0;
    const tempPos = new THREE.Vector3();

    const animate = () => {
      if (autoRotate) {
        globeGroup.rotation.y += 0.0024;
      }
      // Inner orbit revolves continuously inside the globe
      orbitAngle += 0.0055;

      // Update travelling photons on flight arcs
      arcPulses.forEach((pulse) => {
        pulse.progress = (pulse.progress + pulse.speed * 2.6) % 1;
        const pt = pulse.curve.getPoint(pulse.progress);
        pulse.mesh.position.copy(pt);
      });

      // Update positions of all 6 key points inside the globe
      keyPointNodes.forEach((kp, idx) => {
        const el = badgeRefs.current[idx];
        if (!el) return;

        // Evenly space 6 key points at 60 degree intervals (2 * PI / 6)
        const angle = orbitAngle + (idx * Math.PI * 2) / 6;

        // 3D position in inclined orbit inside the globe
        const localX = Math.cos(angle) * ORBIT_RADIUS;
        const localZ = Math.sin(angle) * ORBIT_RADIUS;
        // Subtle vertical wave so points don't occlude one another
        const localY = Math.sin(angle * 1.5 + idx * 0.8) * 0.22;

        kp.nodeGroup.position.set(localX, localY, localZ);

        // Get world position for screen projection
        kp.nodeGroup.getWorldPosition(tempPos);

        // Depth calculation: z in camera space
        const worldZ = tempPos.z;
        const isFront = worldZ > 0.1;

        // Project 3D coordinate to 2D screen coordinates
        tempPos.project(camera);
        const px = ((tempPos.x + 1) * width) / 2;
        const py = ((-tempPos.y + 1) * height) / 2;

        // ALL 6 POINTS REMAIN VISIBLE AT ALL TIMES!
        // Adapt scale for mobile viewports to prevent clipping and overlap
        const isMobileScreen = width < 520;
        const depthFactor = (worldZ + 1.0) / 2.0; // 0 (back) to 1 (front)
        const opacity = 0.58 + 0.42 * depthFactor;
        const scale = (isMobileScreen ? 0.68 : 0.80) + (isMobileScreen ? 0.18 : 0.25) * depthFactor;

        el.style.opacity = opacity.toFixed(2);
        el.style.transform = `translate3d(${px}px, ${py}px, 0) translate(-50%, -50%) scale(${scale.toFixed(2)})`;
        el.style.zIndex = Math.round(depthFactor * 30 + 10).toString();

        // Dynamically style based on front vs inner depth
        if (isFront) {
          el.setAttribute("data-front", "true");
        } else {
          el.setAttribute("data-front", "false");
        }
      });

      renderer.render(scene, camera);
      if (isVisible) {
        raf = requestAnimationFrame(animate);
      }
    };

    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = isVisible;
        isVisible = entry.isIntersecting;
        if (!wasVisible && isVisible) {
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(animate);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    raf = requestAnimationFrame(animate);

    // ─── 10. RESIZE & CLEANUP ───
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || 640;
      height = container.clientHeight || 640;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
      dom.removeEventListener("pointerdown", onMouseDown);
      window.removeEventListener("pointermove", onMouseMove);
      window.removeEventListener("pointerup", onMouseUp);
      window.removeEventListener("resize", handleResize);
      if (dom && container.contains(dom)) {
        container.removeChild(dom);
      }
      renderer.dispose();
      earthGeometry.dispose();
      atmosGeometry.dispose();
      earthMaterial.dispose();
      atmosMaterial.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative mx-auto aspect-square w-full select-none ${className}`}
      role="img"
      aria-label="3D rotating cybernetic blue Earth globe with all 6 key points rotating inside"
    >
      {/* ALL 6 KEY POINTS ROTATING INSIDE THE 3D GLOBE SIMULTANEOUSLY */}
      {KEY_POINTS.map((kp, idx) => (
        <div
          key={kp.name}
          ref={(el) => (badgeRefs.current[idx] = el)}
          className="pointer-events-none absolute left-0 top-0 transition-opacity duration-100 will-change-transform"
          style={{ opacity: 0 }}
        >
          {/* Card-matching Badge: Pure White Text + Royal Blue Glowing Border + Deep Sapphire Glass */}
          <div className="relative flex items-center gap-1 sm:gap-1.5 whitespace-nowrap rounded-full border border-[#60a5fa]/70 bg-gradient-to-r from-[#0e276b]/95 to-[#091e52]/95 px-2 py-0.5 sm:px-3 sm:py-1 shadow-[0_4px_16px_rgba(29,78,216,0.6)] backdrop-blur-md">
            {/* Glowing Pure White Beacon with Radar Ping */}
            <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
            </span>

            {/* Clear Crisp White Text for 100% High Visibility */}
            <span className="text-[10px] sm:text-xs font-black tracking-wide text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.95)]">
              {kp.name}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
