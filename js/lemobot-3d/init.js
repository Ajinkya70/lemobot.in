import { attachScene } from "./core.js";
import {
  createNetworkScene,
  createGridScene,
  createHubScene,
  createLayersScene,
  createGlobeConnectScene,
} from "./scenes.js";

const sceneMap = {
  network: createNetworkScene,
  grid: createGridScene,
  hub: createHubScene,
  layers: createLayersScene,
  "globe-connect": createGlobeConnectScene,
};

function initHeroScenes() {
  const hosts = document.querySelectorAll(".lemobot-3d-canvas-host");
  if (!hosts.length) return;

  const prefersReducedMotion = window.matchMedia?.(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const instances = [];

  hosts.forEach((host) => {
    const sceneId = host.dataset.lemobotScene || "network";
    const makeScene = sceneMap[sceneId] || sceneMap.network;

    if (prefersReducedMotion) {
      host.classList.add("is-static");
      return;
    }

    const instance = attachScene(host, makeScene);
    instances.push(instance);
  });

  window.addEventListener(
    "pagehide",
    () => {
      instances.forEach((i) => i.dispose?.());
    },
    { once: true },
  );
}

function initTiltCards() {
  // Auto-apply tilt to portfolio .card-hover elements too
  document.querySelectorAll(".card-hover").forEach((el) => {
    el.classList.add("lemobot-tilt-card");
  });
  const prefersReducedMotion = window.matchMedia?.(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (prefersReducedMotion) return;

  const cards = document.querySelectorAll(".lemobot-tilt-card");
  if (!cards.length) return;

  const maxTilt = 6; // degrees

  cards.forEach((card) => {
    let frame;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    function update() {
      currentX += (targetX - currentX) * 0.15;
      currentY += (targetY - currentY) * 0.15;
      card.style.transform = `rotateX(${currentY}deg) rotateY(${currentX}deg) translateZ(0)`;
      if (Math.abs(targetX - currentX) > 0.01 || Math.abs(targetY - currentY) > 0.01) {
        frame = requestAnimationFrame(update);
      } else {
        frame = null;
      }
    }

    function handlePointerMove(event) {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      targetX = -x * maxTilt;
      targetY = y * maxTilt;
      if (!frame) {
        frame = requestAnimationFrame(update);
      }
    }

    function reset() {
      targetX = 0;
      targetY = 0;
      if (!frame) {
        frame = requestAnimationFrame(update);
      }
    }

    card.classList.add("is-tilting");
    card.addEventListener("pointermove", handlePointerMove);
    card.addEventListener("pointerleave", reset);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initHeroScenes();
    initTiltCards();
  });
} else {
  initHeroScenes();
  initTiltCards();
}

