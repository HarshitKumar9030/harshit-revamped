"use client";
import React, { useEffect, useRef } from 'react';

// --- Types & Interfaces ---
interface MagnetState {
  x: number;
  y: number;
}

interface MouseState {
  x: number;
  y: number;
  r: number;
}

// --- Physics Class ---
class PhysicsBlob {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  tx: number;
  ty: number;

  constructor(x: number, y: number, r: number) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.r = r;
    // Idle floating anchors
    this.tx = (Math.random() - 0.5) * 500;
    this.ty = (Math.random() - 0.5) * 300;
  }

  update(
    width: number,
    height: number,
    mouse: MouseState,
    activeMagnet: MagnetState | null
  ) {
    let cx, cy, pullStrength;
    if (activeMagnet) {
      cx = activeMagnet.x + (Math.random() - 0.5) * 30;
      cy = activeMagnet.y + (Math.random() - 0.5) * 30;
      pullStrength = 0.006;
    } else {
      cx = width / 2 + this.tx;
      cy = height / 2 - 50 + this.ty;
      pullStrength = 0.0006;
    }

    // Spring forces
    this.vx += (cx - this.x) * pullStrength;
    this.vy += (cy - this.y) * pullStrength;

    // Mouse Pull
    if (!activeMagnet) {
      const dxM = mouse.x - this.x;
      const dyM = mouse.y - this.y;
      const distM = Math.sqrt(dxM * dxM + dyM * dyM);
      if (distM > 0 && distM < 400) {
        this.vx += (dxM / distM) * 0.25;
        this.vy += (dyM / distM) * 0.25;
      }
    }

    // Friction
    this.vx *= 0.92;
    this.vy *= 0.92;
    this.x += this.vx;
    this.y += this.vy;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

// --- Component ---
export const FluidLanding: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const glCanvasRef = useRef<HTMLCanvasElement>(null);
  const physicsCanvasRef = useRef<HTMLCanvasElement>(null);

  // Mutable state held in refs to avoid React re-renders during the 60fps loop
  const state = useRef({
    width: 0,
    height: 0,
    mouse: { x: -1000, y: -1000, r: 80 } as MouseState,
    targetMouse: { x: -1000, y: -1000, r: 80 } as MouseState,
    activeMagnet: null as MagnetState | null,
    blobs: [] as PhysicsBlob[],
  });

  // Event Handlers for Magnetic UI
  const handleMagnetEnter = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    state.current.activeMagnet = {
      x: rect.left - (containerRect?.left ?? 0) + rect.width / 2,
      y: rect.top - (containerRect?.top ?? 0) + rect.height / 2,
    };
    state.current.targetMouse.r = 220;
  };

  const handleMagnetLeave = () => {
    state.current.activeMagnet = null;
    state.current.targetMouse.r = 80;
  };

  useEffect(() => {
    const glCanvas = glCanvasRef.current;
    const pCanvas = physicsCanvasRef.current;
    const container = containerRef.current;
    if (!glCanvas || !pCanvas || !container) return;

    const gl = glCanvas.getContext('webgl2');
    const ctx = pCanvas.getContext('2d');
    if (!gl || !ctx) return;

    let frameId: number | null = null;
    let isVisible = true;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // --- Interaction Listeners ---
    const updateMouse = (x: number, y: number) => {
      // Initialize if offscreen
      if (state.current.mouse.x === -1000) {
        state.current.mouse.x = x;
        state.current.mouse.y = y;
      }
      state.current.targetMouse.x = x;
      state.current.targetMouse.y = y;
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      updateMouse(e.clientX - rect.left, e.clientY - rect.top);
    };

    const triggerShockwave = () => {
      state.current.targetMouse.r = 30; // Shrink cursor sharply
      const { mouse, blobs } = state.current;
      blobs.forEach((b) => {
        const dx = b.x - mouse.x;
        const dy = b.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0 && dist < 600) {
          const force = (600 - dist) * 0.2;
          b.vx += (dx / dist) * force;
          b.vy += (dy / dist) * force;
        }
      });
    };

    const restoreCursor = () => {
      state.current.targetMouse.r = state.current.activeMagnet ? 220 : 80;
    };

    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerdown", triggerShockwave);
    container.addEventListener("pointerup", restoreCursor);
    container.addEventListener("pointercancel", restoreCursor);

    // --- Initialization & Resizing ---
    const initPhysics = () => {
      const { width, height } = state.current;
      state.current.blobs = Array.from({ length: reduceMotion ? 8 : 14 }, () => {
        const r = 18 + Math.random() * 62;
        return new PhysicsBlob(
          width / 2 + (Math.random() - 0.5) * 300,
          height / 2 + (Math.random() - 0.5) * 300,
          r
        );
      });
    };

    const resize = () => {
      const { width: containerWidth, height: containerHeight } = container.getBoundingClientRect();
      const width = Math.max(1, Math.floor(containerWidth));
      const height = Math.max(1, Math.floor(containerHeight));
      state.current.width = width;
      state.current.height = height;

      pCanvas.width = width;
      pCanvas.height = height;
      glCanvas.width = width;
      glCanvas.height = height;
      
      gl.viewport(0, 0, width, height);
      if (resLoc) gl.uniform2f(resLoc, width, height);

      initPhysics();
    };

    // --- WebGL Shader Setup ---
    const vsSource = `#version 300 es
      in vec4 aPosition;
      void main() { gl_Position = aPosition; }
    `;

    const fsSource = `#version 300 es
      precision highp float;
      out vec4 fragColor;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;

      float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
      float noise(vec2 p) {
          vec2 i = floor(p); vec2 f = fract(p);
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
                     mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
      }
      float fbm(vec2 p) {
          float v = 0.0; float a = 0.5;
          mat2 rot = mat2(cos(0.5), -sin(0.5), sin(0.5), cos(0.5));
          for (int i = 0; i < 3; ++i) {
              v += a * noise(p); p = rot * p * 2.0 + vec2(100.0); a *= 0.5;
          }
          return v;
      }

      void main() {
          vec2 st = gl_FragCoord.xy / u_resolution.xy * 2.5;
          st.x *= u_resolution.x / u_resolution.y;
          
          vec2 m = u_mouse / u_resolution.xy;
          m.y = 1.0 - m.y; m *= 2.5; m.x *= u_resolution.x / u_resolution.y;

          float t = u_time * 0.25; 

          // Mouse Push Interaction
          float distToMouse = distance(st, m);
          st += normalize(st - m) * exp(-distToMouse * 3.0) * 0.3;

          // Domain Warping
          vec2 q = vec2(0.0);
          q.x = fbm(st + vec2(0.0));
          q.y = fbm(st + vec2(1.0));

          vec2 r = vec2(0.0);
          r.x = fbm(st + 1.0 * q + vec2(1.7, 9.2) + 0.15 * t);
          r.y = fbm(st + 1.0 * q + vec2(8.3, 2.8) + 0.12 * t);

          float f = fbm(st + r);

          // Elevate Palette
          vec3 colBg = vec3(0.02, 0.0, 0.05);
          vec3 col1  = vec3(1.0, 0.15, 0.3);
          vec3 col2  = vec3(0.0, 0.6, 1.0);
          vec3 col3  = vec3(0.6, 0.0, 1.0);

          vec3 color = mix(colBg, col1, clamp((f * f) * 2.5, 0.0, 1.0));
          color = mix(color, col2, clamp(length(q) * 0.9, 0.0, 1.0));
          color = mix(color, col3, clamp(length(r.x) * 1.8, 0.0, 1.0));

          float mouseGlow = exp(-distToMouse * 3.5) * 1.0;
          color += vec3(0.3, 0.6, 1.0) * mouseGlow;

          vec2 center = gl_FragCoord.xy / u_resolution.xy - 0.5;
          float vignette = 1.0 - dot(center, center) * 1.2;
          
          vec3 finalColor = (f * f + 0.5 * f) * color * 2.5;
          finalColor *= smoothstep(0.0, 1.0, vignette);

          fragColor = vec4(finalColor, 1.0);
      }
    `;

    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const program = gl.createProgram();
    const vShader = compileShader(gl.VERTEX_SHADER, vsSource);
    const fShader = compileShader(gl.FRAGMENT_SHADER, fsSource);
    if (!program || !vShader || !fShader) return;

    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posLoc = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const timeLoc = gl.getUniformLocation(program, 'u_time');
    const resLoc = gl.getUniformLocation(program, 'u_resolution');
    const mouseLoc = gl.getUniformLocation(program, 'u_mouse');

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    const clamp = (min: number, val: number, max: number) =>
      Math.max(min, Math.min(max, val));

    const renderPhysics = () => {
      const { width, height, mouse, targetMouse, activeMagnet, blobs } = state.current;

      mouse.x += (targetMouse.x - mouse.x) * 0.15;
      mouse.y += (targetMouse.y - mouse.y) * 0.15;
      mouse.r += (targetMouse.r - mouse.r) * 0.12;

      // Trail Fade
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = `rgba(0, 0, 0, 0.25)`;
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'white';

      // Typography
      ctx.font = `800 ${clamp(80, width * 0.15, 250)}px 'Syne', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.letterSpacing = '-0.04em';
      ctx.fillText('SHAPE', width / 2, height / 2 - 60);

      // Resolve soft collisions
      for (let i = 0; i < blobs.length; i++) {
        for (let j = i + 1; j < blobs.length; j++) {
          const b1 = blobs[i];
          const b2 = blobs[j];
          const dx = b1.x - b2.x;
          const dy = b1.y - b2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = b1.r + b2.r;
          if (dist < minDist && dist > 0) {
            const force = (minDist - dist) * 0.04;
            const nx = dx / dist;
            const ny = dy / dist;
            b1.vx += nx * force;
            b1.vy += ny * force;
            b2.vx -= nx * force;
            b2.vy -= ny * force;
          }
        }
      }

      blobs.forEach((blob) => {
        blob.update(width, height, mouse, activeMagnet);
        blob.draw(ctx);
      });

      // Draw active cursor
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, mouse.r, 0, Math.PI * 2);
      ctx.fill();

    };

    const render = (time: number) => {
      frameId = null;
      if (!isVisible) return;

      gl.uniform1f(timeLoc, time * 0.001);
      gl.uniform2f(mouseLoc, state.current.mouse.x, state.current.mouse.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      renderPhysics();

      if (!reduceMotion) {
        frameId = requestAnimationFrame(render);
      }
    };

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible && frameId === null) {
        frameId = requestAnimationFrame(render);
      }
    });
    visibilityObserver.observe(container);
    frameId = requestAnimationFrame(render);

    // Cleanup
    return () => {
      if (frameId !== null) cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerdown", triggerShockwave);
      container.removeEventListener("pointerup", restoreCursor);
      container.removeEventListener("pointercancel", restoreCursor);
    };
  }, []);

  return (
    <div ref={containerRef} className="fluid-landing-container">
      {/* Dynamic Styles Specific to the Component */}
      <style>{`
        .fluid-landing-container {
          --bg-color: #020203;
          --text-light: #ffffff;
          --text-muted: #888890;
          --accent: rgba(255, 255, 255, 0.08);
          --border: rgba(255, 255, 255, 0.12);
          
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background-color: var(--bg-color);
          font-family: 'Inter', sans-serif;
          color: var(--text-light);
          user-select: none;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }

        .gl-canvas {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          z-index: 1;
          pointer-events: none;
        }

        .mask-container {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          z-index: 2;
          background-color: var(--bg-color);
          mix-blend-mode: multiply;
          pointer-events: none;
        }

        .physics-canvas {
          width: 100%; height: 100%;
          filter: url(#gooey-filter);
        }

        .texture-overlay {
          position: absolute; top: 0; left: 0;
          width: 100%; height: 100%; z-index: 3;
          pointer-events: none;
          background-image: 
              linear-gradient(var(--border) 1px, transparent 1px),
              linear-gradient(90deg, var(--border) 1px, transparent 1px),
              url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          background-size: 100px 100px, 100px 100px, 100px 100px;
          background-position: center center;
          opacity: 0.15;
          mask-image: radial-gradient(circle at center, black 20%, transparent 80%);
          -webkit-mask-image: radial-gradient(circle at center, black 20%, transparent 80%);
        }

        .ui-layer {
          position: absolute; top: 0; left: 0;
          width: 100%; height: 100%;
          z-index: 10;
          display: flex; flex-direction: column;
          pointer-events: none;
        }

        .interactive { pointer-events: auto; }

        .landing-nav {
          display: flex; justify-content: space-between; align-items: center;
          padding: 2rem 4rem;
        }

        .landing-logo {
          font-family: 'Syne', sans-serif;
          font-weight: 800; font-size: 1.8rem;
          letter-spacing: -1px; cursor: pointer;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .landing-logo:hover { transform: scale(1.08) rotate(-2deg); }

        .landing-nav-links {
          display: flex; gap: 2.5rem;
          background: rgba(0,0,0,0.4);
          padding: 0.75rem 2rem;
          border-radius: 100px;
          border: 1px solid var(--border);
          backdrop-filter: blur(12px);
        }

        .landing-nav-links a {
          color: var(--text-light); text-decoration: none;
          font-size: 0.85rem; font-weight: 500;
          opacity: 0.6; transition: all 0.3s;
          text-transform: uppercase; letter-spacing: 1px;
        }
        .landing-nav-links a:hover { opacity: 1; transform: translateY(-1px); }

        .landing-nav-btn {
          background: #fff; color: #000;
          border: none; padding: 0.75rem 1.8rem;
          border-radius: 100px; font-weight: 600; font-size: 0.85rem;
          cursor: pointer; transition: all 0.3s;
        }
        .landing-nav-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(255, 255, 255, 0.2);
        }

        .landing-hero {
          flex: 1; display: flex; flex-direction: column;
          justify-content: space-between; align-items: center;
          text-align: center; padding: 4rem 2rem;
        }

        .landing-badge {
          background: var(--accent);
          border: 1px solid var(--border);
          padding: 0.5rem 1.2rem; border-radius: 50px;
          font-size: 0.75rem; font-weight: 500;
          letter-spacing: 2px; text-transform: uppercase;
          backdrop-filter: blur(5px);
          color: var(--text-muted);
        }

        .landing-hero-spacer { height: clamp(100px, 20vw, 300px); }

        .landing-hero-copy {
          max-width: 600px;
          display: flex; flex-direction: column; align-items: center; gap: 2rem;
        }

        .landing-subtitle {
          font-size: clamp(1rem, 1.5vw, 1.2rem);
          font-weight: 300; color: var(--text-muted);
          line-height: 1.6; margin: 0;
        }

        .landing-cta-btn {
          background: transparent; color: #fff;
          border: 1px solid rgba(255,255,255,0.3);
          padding: 1.2rem 3rem; border-radius: 100px;
          font-family: 'Syne', sans-serif;
          font-size: 1.1rem; font-weight: 700;
          cursor: pointer; position: relative; overflow: hidden;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .landing-cta-btn:hover {
          border-color: #fff;
          background: rgba(255,255,255,0.1);
          transform: scale(1.05);
          letter-spacing: 2px;
        }

        .hidden-svg { position: absolute; width: 0; height: 0; pointer-events: none; }
      `}</style>

      {/* SVG Gooey Filter */}
      <svg className="hidden-svg">
        <defs>
          <filter id="gooey-filter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="25" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="
                1 0 0 0 0  
                0 1 0 0 0  
                0 0 1 0 0  
                0 0 0 70 -30"
              result="gooey"
            />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Canvases */}
      <canvas ref={glCanvasRef} className="gl-canvas" />
      
      <div className="mask-container">
        <canvas ref={physicsCanvasRef} className="physics-canvas" />
      </div>

      <div className="texture-overlay" />

      {/* User Interface */}
      <div className="ui-layer">
        <nav className="landing-nav">
          <div
            className="landing-logo interactive"
            onMouseEnter={handleMagnetEnter}
            onMouseLeave={handleMagnetLeave}
          >
            OASIS.
          </div>
          <div className="landing-nav-links interactive">
            {['Engine', 'Showcase', 'Pricing'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onMouseEnter={handleMagnetEnter}
                onMouseLeave={handleMagnetLeave}
              >
                {item}
              </a>
            ))}
          </div>
          <button
            className="landing-nav-btn interactive"
            onMouseEnter={handleMagnetEnter}
            onMouseLeave={handleMagnetLeave}
          >
            Get Access
          </button>
        </nav>

        <div className="landing-hero">
          <div className="landing-badge">The New Standard for WebGL</div>
          <div className="landing-hero-spacer" />
          <div className="landing-hero-copy">
            <p className="landing-subtitle">
              A physics-driven fluid interface designed to blur the line between
              digital canvas and interactive reality.
            </p>
            <button
              className="landing-cta-btn interactive"
              onMouseEnter={handleMagnetEnter}
              onMouseLeave={handleMagnetLeave}
            >
              Deploy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FluidLanding;
