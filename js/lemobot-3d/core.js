import * as THREE from "three";

/**
 * Attach a Three.js scene to a host element.
 * makeScene(host, opts) => { scene, camera, update(time, pointer, phase) }
 */
export function attachScene(host, makeScene, options = {}) {
  const opts = {
    maxDPRDesktop: 2,
    maxDPRMobile: 1.5,
    mobileBreakpoint: 767,
    ...options,
  };

  const prefersReducedMotion = window.matchMedia?.(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) {
    host.classList.add("is-static");
    return { dispose() {} };
  }

  const canvas = document.createElement("canvas");
  host.appendChild(canvas);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
  });

  const isMobile =
    window.matchMedia &&
    window.matchMedia(`(max-width: ${opts.mobileBreakpoint}px)`).matches;
  const maxDPR = isMobile ? opts.maxDPRMobile : opts.maxDPRDesktop;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDPR));

  const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };

  const sceneResult = makeScene(host, {
    isMobile,
    prefersReducedMotion,
  });
  const scene = sceneResult.scene;
  const camera = sceneResult.camera;
  const update = sceneResult.update;

  let width = host.clientWidth || 1;
  let height = host.clientHeight || 1;

  function resize() {
    width = host.clientWidth || 1;
    height = host.clientHeight || 1;
    renderer.setSize(width, height, false);
    if (camera.isPerspectiveCamera) {
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
  }

  resize();

  const resizeObserver =
    "ResizeObserver" in window
      ? new ResizeObserver(() => resize())
      : null;
  if (resizeObserver) {
    resizeObserver.observe(host);
  } else {
    window.addEventListener("resize", resize);
  }

  let running = true;
  let frameId = null;
  let lastTime = performance.now();

  function onPointerMove(event) {
    const rect = host.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    pointer.targetX = x;
    pointer.targetY = y;
  }

  if (!isMobile && !prefersReducedMotion) {
    window.addEventListener("pointermove", onPointerMove);
  }

  function loop(now) {
    if (!running) return;
    frameId = requestAnimationFrame(loop);
    const dt = now - lastTime;
    lastTime = now;

    // simple smoothing
    pointer.x += (pointer.targetX - pointer.x) * 0.08;
    pointer.y += (pointer.targetY - pointer.y) * 0.08;

    update(now, pointer, { dt, width, height });
    renderer.render(scene, camera);
  }

  function handleVisibility() {
    const hidden = document.hidden;
    if (hidden && running) {
      running = false;
      if (frameId != null) cancelAnimationFrame(frameId);
      frameId = null;
    } else if (!hidden && !running) {
      running = true;
      lastTime = performance.now();
      frameId = requestAnimationFrame(loop);
    }
  }

  document.addEventListener("visibilitychange", handleVisibility);
  window.addEventListener("pagehide", dispose, { once: true });

  // start
  frameId = requestAnimationFrame(loop);

  function dispose() {
    running = false;
    if (frameId != null) cancelAnimationFrame(frameId);
    document.removeEventListener("visibilitychange", handleVisibility);
    window.removeEventListener("pagehide", dispose);
    if (!isMobile && !prefersReducedMotion) {
      window.removeEventListener("pointermove", onPointerMove);
    }
    if (resizeObserver) {
      resizeObserver.disconnect();
    } else {
      window.removeEventListener("resize", resize);
    }
    renderer.dispose();
    scene.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose?.();
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose?.());
        } else {
          obj.material.dispose?.();
        }
      }
    });
    if (canvas.parentNode === host) {
      host.removeChild(canvas);
    }
  }

  return { dispose };
}

