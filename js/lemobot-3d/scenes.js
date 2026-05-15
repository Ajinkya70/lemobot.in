import * as THREE from "three";

function createBasicScene() {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0xf0eded, 0.035);

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50);
  camera.position.set(0, 0, 12);

  return { scene, camera };
}

export function createNetworkScene(host, { isMobile }) {
  const isHeroFrame = Boolean(host.closest(".lemobot-hero-visual-frame"));
  const { scene, camera } = createBasicScene();

  if (isHeroFrame) {
    scene.fog = null;
    camera.position.set(0, 0, 10);
  }

  const group = new THREE.Group();
  if (isHeroFrame) {
    group.position.set(0.2, 0, 0);
  }
  scene.add(group);

  const globeSize = isHeroFrame ? 2.6 : 3.3;
  const globeGeom = new THREE.IcosahedronGeometry(globeSize, isHeroFrame ? 3 : 2);
  const globeMat = new THREE.MeshBasicMaterial({
    color: isHeroFrame ? 0x4da3ff : 0x0a3d62,
    wireframe: true,
    transparent: true,
    opacity: isHeroFrame ? 0.55 : 0.4,
  });
  const globe = new THREE.Mesh(globeGeom, globeMat);
  group.add(globe);

  const innerGlow = new THREE.Mesh(
    new THREE.IcosahedronGeometry(globeSize * 0.92, 1),
    new THREE.MeshBasicMaterial({
      color: 0x0075d6,
      wireframe: true,
      transparent: true,
      opacity: isHeroFrame ? 0.12 : 0.06,
    }),
  );
  group.add(innerGlow);

  const pointCount = isMobile ? (isHeroFrame ? 70 : 60) : isHeroFrame ? 130 : 110;
  const positions = new Float32Array(pointCount * 3);
  const points = [];
  for (let i = 0; i < pointCount; i++) {
    const phi = Math.acos(2 * Math.random() - 1);
    const theta = 2 * Math.PI * Math.random();
    const r = 4.5;
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.cos(phi);
    const z = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    points.push(new THREE.Vector3(x, y, z));
  }

  const pointGeom = new THREE.BufferGeometry();
  pointGeom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const pointMat = new THREE.PointsMaterial({
    color: isHeroFrame ? 0xffffff : 0xa2caf7,
    size: isHeroFrame ? 0.07 : 0.055,
    sizeAttenuation: true,
    transparent: true,
    opacity: isHeroFrame ? 0.9 : 1,
  });
  const pointCloud = new THREE.Points(pointGeom, pointMat);
  group.add(pointCloud);

  // Dynamic line connections between nearby points
  const maxSegments = isMobile ? 260 : 420;
  const lineGeom = new THREE.BufferGeometry();
  const linePositions = new Float32Array(maxSegments * 2 * 3);
  lineGeom.setAttribute(
    "position",
    new THREE.BufferAttribute(linePositions, 3),
  );
  const lineMat = new THREE.LineBasicMaterial({
    color: isHeroFrame ? 0x66b3ff : 0x005cab,
    transparent: true,
    opacity: isHeroFrame ? 0.45 : 0.28,
  });
  const lineSegments = new THREE.LineSegments(lineGeom, lineMat);
  group.add(lineSegments);

  function rebuildLines(time) {
    const threshold = 3.6 + 0.6 * Math.sin(time * 0.00015);
    let idx = 0;
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const a = points[i];
        const b = points[j];
        const dist = a.distanceTo(b);
        if (dist < threshold && idx < maxSegments) {
          linePositions[idx * 6] = a.x;
          linePositions[idx * 6 + 1] = a.y;
          linePositions[idx * 6 + 2] = a.z;
          linePositions[idx * 6 + 3] = b.x;
          linePositions[idx * 6 + 4] = b.y;
          linePositions[idx * 6 + 5] = b.z;
          idx++;
        }
      }
    }
    for (let k = idx * 6; k < linePositions.length; k++) {
      linePositions[k] = 0;
    }
    lineGeom.attributes.position.needsUpdate = true;
  }

  return {
    scene,
    camera,
    update(time, pointer) {
      const speed = isHeroFrame ? 0.00008 : 0.00012;
      const t = time * speed;
      group.rotation.y = t + pointer.x * (isHeroFrame ? 0.5 : 0.7);
      group.rotation.x = t * 0.35 - pointer.y * (isHeroFrame ? 0.45 : 0.6);
      innerGlow.rotation.y = -t * 1.2;
      innerGlow.rotation.z = t * 0.8;
      rebuildLines(time);
    },
  };
}

// Grid scene: receding perspective floor grid + calm particle field
export function createGridScene(host, { isMobile }) {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0xf6f3f2, 0.04);
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 60);
  camera.position.set(0, 3, 10);
  camera.lookAt(0, 0, 0);

  const group = new THREE.Group();
  scene.add(group);

  // Perspective grid on XZ plane
  const gridHelper = new THREE.GridHelper(28, 24, 0x005cab, 0xa2caf7);
  gridHelper.material.transparent = true;
  gridHelper.material.opacity = 0.22;
  gridHelper.position.y = -2.5;
  group.add(gridHelper);

  // A second tighter grid for depth
  const gridHelper2 = new THREE.GridHelper(28, 8, 0x005cab, 0x005cab);
  gridHelper2.material.transparent = true;
  gridHelper2.material.opacity = 0.12;
  gridHelper2.position.y = -2.5;
  group.add(gridHelper2);

  // Particle field floating above the grid
  const pCount = isMobile ? 40 : 80;
  const pPos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    pPos[i * 3] = (Math.random() - 0.5) * 14;
    pPos[i * 3 + 1] = Math.random() * 5 - 1;
    pPos[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }
  const pGeom = new THREE.BufferGeometry();
  pGeom.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({ color: 0x0075d6, size: 0.06, sizeAttenuation: true });
  const particles = new THREE.Points(pGeom, pMat);
  group.add(particles);

  return {
    scene,
    camera,
    update(time, pointer) {
      group.rotation.y = pointer.x * 0.3;
      camera.position.y = 3 - pointer.y * 1.2;
      camera.lookAt(0, 0, 0);
      particles.rotation.y = time * 0.00006;
    },
  };
}

// Hub scene: central icosahedron with 6 orbiting spheres
export function createHubScene(host, { isMobile }) {
  const { scene, camera } = createBasicScene();
  camera.position.set(0, 0, 14);

  const group = new THREE.Group();
  scene.add(group);

  // Center node
  const centerGeom = new THREE.IcosahedronGeometry(1.2, 1);
  const centerMat = new THREE.MeshBasicMaterial({ color: 0x002743, wireframe: true, transparent: true, opacity: 0.55 });
  const center = new THREE.Mesh(centerGeom, centerMat);
  group.add(center);

  // Orbit ring
  const orbitGeom = new THREE.TorusGeometry(4.4, 0.015, 8, 80);
  const orbitMat = new THREE.MeshBasicMaterial({ color: 0x005cab, transparent: true, opacity: 0.25 });
  const orbitRing = new THREE.Mesh(orbitGeom, orbitMat);
  group.add(orbitRing);

  const satCount = 6;
  const satellites = [];
  for (let i = 0; i < satCount; i++) {
    const angle = (i / satCount) * Math.PI * 2;
    const satGeom = new THREE.SphereGeometry(0.28, 8, 8);
    const satMat = new THREE.MeshBasicMaterial({ color: 0xa2caf7, transparent: true, opacity: 0.85 });
    const sat = new THREE.Mesh(satGeom, satMat);
    sat.position.set(Math.cos(angle) * 4.4, Math.sin(angle) * 0.4, Math.sin(angle) * 4.4);
    group.add(sat);
    satellites.push({ mesh: sat, startAngle: angle });

    // Line from center to sat
    const lineG = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), sat.position.clone()]);
    const lineM = new THREE.LineBasicMaterial({ color: 0x0075d6, transparent: true, opacity: 0.35 });
    const line = new THREE.Line(lineG, lineM);
    group.add(line);
    satellites[satellites.length - 1].line = line;
  }

  return {
    scene,
    camera,
    update(time, pointer) {
      const t = time * 0.0008;
      group.rotation.y = t * 0.15 + pointer.x * 0.5;
      group.rotation.x = pointer.y * -0.4;
      center.rotation.y = t * 0.5;

      satellites.forEach((s, i) => {
        const angle = s.startAngle + t * (0.45 + i * 0.04);
        s.mesh.position.set(
          Math.cos(angle) * 4.4,
          Math.sin(angle * 1.3) * 0.6,
          Math.sin(angle) * 4.4,
        );
        const pos = s.line?.geometry.attributes.position;
        if (pos) {
          pos.setXYZ(1, s.mesh.position.x, s.mesh.position.y, s.mesh.position.z);
          pos.needsUpdate = true;
        }
      });
    },
  };
}

// Layers scene: translucent floating planes drifting slowly
export function createLayersScene(host, { isMobile }) {
  const { scene, camera } = createBasicScene();
  camera.position.set(0, 0, 13);
  scene.fog = new THREE.FogExp2(0xeae7e7, 0.028);

  const group = new THREE.Group();
  scene.add(group);

  const planeCount = isMobile ? 3 : 5;
  const planes = [];
  for (let i = 0; i < planeCount; i++) {
    const w = 5 + Math.random() * 3;
    const h = 3 + Math.random() * 2;
    const geom = new THREE.BoxGeometry(w, h, 0.06);
    const mat = new THREE.MeshBasicMaterial({
      color: i % 2 === 0 ? 0x0a3d62 : 0x005cab,
      transparent: true,
      opacity: 0.07 + i * 0.025,
      wireframe: i % 3 === 0,
    });
    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.set(
      (Math.random() - 0.5) * 4,
      (i - planeCount / 2) * 1.6,
      (Math.random() - 0.5) * 3,
    );
    mesh.rotation.z = (Math.random() - 0.5) * 0.25;
    group.add(mesh);
    planes.push({ mesh, speed: 0.00012 + Math.random() * 0.00008 });
  }

  return {
    scene,
    camera,
    update(time, pointer) {
      planes.forEach((p) => {
        p.mesh.position.y += p.speed;
        if (p.mesh.position.y > planeCount * 0.8) p.mesh.position.y = -planeCount * 0.8;
        p.mesh.rotation.y = pointer.x * 0.3;
      });
      group.rotation.y = pointer.x * 0.25;
      group.rotation.x = -pointer.y * 0.2;
    },
  };
}

// Globe-connect scene: globe + arc lines
export function createGlobeConnectScene(host, { isMobile }) {
  const { scene, camera } = createBasicScene();
  camera.position.set(0, 1, 12);

  const group = new THREE.Group();
  scene.add(group);

  const globeGeom = new THREE.SphereGeometry(3, isMobile ? 14 : 22, isMobile ? 14 : 22);
  const globeMat = new THREE.MeshBasicMaterial({
    color: 0x0a3d62,
    wireframe: true,
    transparent: true,
    opacity: 0.3,
  });
  const globe = new THREE.Mesh(globeGeom, globeMat);
  group.add(globe);

  // Arc lines on the globe surface
  const arcCount = isMobile ? 3 : 5;
  for (let i = 0; i < arcCount; i++) {
    const phi1 = Math.random() * Math.PI;
    const theta1 = Math.random() * 2 * Math.PI;
    const phi2 = Math.random() * Math.PI;
    const theta2 = Math.random() * 2 * Math.PI;
    const start = new THREE.Vector3(
      Math.sin(phi1) * Math.cos(theta1),
      Math.cos(phi1),
      Math.sin(phi1) * Math.sin(theta1),
    ).multiplyScalar(3.05);
    const end = new THREE.Vector3(
      Math.sin(phi2) * Math.cos(theta2),
      Math.cos(phi2),
      Math.sin(phi2) * Math.sin(theta2),
    ).multiplyScalar(3.05);
    const mid = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(4.1);
    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    const arcPoints = curve.getPoints(36);
    const arcGeom = new THREE.BufferGeometry().setFromPoints(arcPoints);
    const arcMat = new THREE.LineBasicMaterial({ color: 0xa2caf7, transparent: true, opacity: 0.55 });
    group.add(new THREE.Line(arcGeom, arcMat));

    // Endpoint dots
    [start, end].forEach((pt) => {
      const dotGeom = new THREE.SphereGeometry(0.1, 6, 6);
      const dotMat = new THREE.MeshBasicMaterial({ color: 0x005cab });
      const dot = new THREE.Mesh(dotGeom, dotMat);
      dot.position.copy(pt);
      group.add(dot);
    });
  }

  return {
    scene,
    camera,
    update(time, pointer) {
      const t = time * 0.0001;
      group.rotation.y = t + pointer.x * 0.6;
      group.rotation.x = t * 0.3 - pointer.y * 0.4;
    },
  };
}

