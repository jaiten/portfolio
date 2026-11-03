"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/* Orca's own body model: an anatomical figure split into 75 clinical regions
   (Abdomen RLQ, Left Lateral Knee, Back (Lower)...). Tapping a region lights it
   up, as in the app, and reports its name. */

const SKIN = new THREE.Color("#ebe3dc");
const HOVER = new THREE.Color("#bfe6f2");
const PICK = new THREE.Color("#ff5a3c");

export const regionName = (raw) =>
  raw
    .replace(/_/g, " ")
    .replace(/\)\)+/g, ")")
    .replace(/^Abdomen \(?([RL][UL]Q)\)?$/, "Abdomen ($1)")
    .trim();

export default function OrcaBody({ selected, onPick }) {
  const mount = useRef(null);
  const api = useRef({});
  const pickRef = useRef(onPick);
  pickRef.current = onPick;

  useEffect(() => {
    const el = mount.current;
    let disposed = false;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = 0.5;

    const key = new THREE.DirectionalLight("#fff4ea", 2.1);
    key.position.set(2.5, 4, 4);
    const fill = new THREE.DirectionalLight("#cfe3ff", 0.6);
    fill.position.set(-3, 2, 2.5);
    const rim = new THREE.DirectionalLight("#8fd3ff", 1.5);
    rim.position.set(-2, 3, -4);
    scene.add(key, fill, rim, new THREE.HemisphereLight("#ffffff", "#2a3a4f", 0.45));

    const camera = new THREE.PerspectiveCamera(28, el.clientWidth / el.clientHeight, 0.05, 100);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.minPolarAngle = Math.PI / 2 - 0.4;
    controls.maxPolarAngle = Math.PI / 2 + 0.2;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.2;
    controls.addEventListener("start", () => (controls.autoRotate = false));

    // Soft contact shadow under the feet.
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d");
    const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, "rgba(0,0,0,0.55)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 128, 128);
    const shadowTex = new THREE.CanvasTexture(c);
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.8), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }));
    shadow.rotation.x = -Math.PI / 2;
    scene.add(shadow);

    const meshes = [];
    const byName = new Map();
    let hovered = null;

    new GLTFLoader().load("/models/orca-body.glb", (gltf) => {
      if (disposed) return;
      const model = gltf.scene;
      model.traverse((o) => {
        if (!o.isMesh) return;
        if (/bodyMesh/i.test(o.name)) return void (o.visible = false);
        o.material = new THREE.MeshPhysicalMaterial({
          color: SKIN.clone(),
          roughness: 0.5,
          sheen: 0.5,
          sheenRoughness: 0.6,
          sheenColor: new THREE.Color("#ffd8c8"),
          clearcoat: 0.1,
          clearcoatRoughness: 0.6,
          emissive: new THREE.Color("#000000")
        });
        o.userData.region = regionName(o.name);
        meshes.push(o);
        byName.set(o.userData.region, o);
      });
      scene.add(model);
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      shadow.position.set(center.x, box.min.y + 0.003, center.z);
      shadow.scale.setScalar(size.y / 2.2);
      controls.target.copy(center);
      const dist = size.y / 2 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * 1.12;
      camera.position.set(center.x, center.y + size.y * 0.04, center.z + dist);
      controls.update();
      api.current.dist = dist;
      api.current.center = center;
      el.classList.add("is-ready");
    });

    const ray = new THREE.Raycaster();
    const ptr = new THREE.Vector2();
    let down = null;
    let pending = null;
    const cast = (e) => {
      const b = renderer.domElement.getBoundingClientRect();
      ptr.set(((e.clientX - b.left) / b.width) * 2 - 1, -((e.clientY - b.top) / b.height) * 2 + 1);
      ray.setFromCamera(ptr, camera);
      return ray.intersectObjects(meshes, false)[0] || null;
    };
    const onMove = (e) => (pending = e);
    const onDown = (e) => (down = { x: e.clientX, y: e.clientY });
    const onUp = (e) => {
      if (!down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 5) return;
      const hit = cast(e);
      if (!hit) return;
      controls.autoRotate = false;
      pickRef.current(hit.object.userData.region);
    };
    const onLeave = () => {
      pending = null;
      hovered = null;
    };
    renderer.domElement.addEventListener("pointermove", onMove);
    renderer.domElement.addEventListener("pointerdown", onDown);
    renderer.domElement.addEventListener("pointerup", onUp);
    renderer.domElement.addEventListener("pointerleave", onLeave);

    let raf;
    let visible = true;
    const io = new IntersectionObserver(([en]) => (visible = en.isIntersecting));
    io.observe(el);
    const clock = new THREE.Clock();
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      if (pending && meshes.length) {
        const hit = cast(pending);
        hovered = hit ? hit.object : null;
        renderer.domElement.style.cursor = hit ? "pointer" : "grab";
        pending = null;
      }
      const pulse = 0.22 + 0.12 * Math.sin(clock.getElapsedTime() * 3);
      const sel = api.current.selected;
      for (const m of meshes) {
        const isSel = m.userData.region === sel;
        m.material.color.lerp(isSel ? PICK : m === hovered ? HOVER : SKIN, 0.2);
        m.material.emissive.copy(PICK).multiplyScalar(isSel ? pulse : 0);
      }
      controls.update();
      renderer.render(scene, camera);
    };
    tick();

    const ro = new ResizeObserver(() => {
      renderer.setSize(el.clientWidth, el.clientHeight);
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
    });
    ro.observe(el);

    api.current.turnTo = (back) => {
      if (!api.current.center) return;
      controls.autoRotate = false;
      const { center, dist } = api.current;
      camera.position.set(center.x, camera.position.y, center.z + (back ? -dist : dist));
      controls.update();
    };
    api.current.has = (name) => byName.has(name);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      controls.dispose();
      meshes.forEach((m) => {
        m.geometry.dispose();
        m.material.dispose();
      });
      shadow.geometry.dispose();
      shadow.material.dispose();
      shadowTex.dispose();
      env.dispose();
      pmrem.dispose();
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    api.current.selected = selected;
  }, [selected]);

  return (
    <div className="orca-canvas" ref={mount}>
      <div className="orca-turn">
        <button type="button" onClick={() => api.current.turnTo?.(false)}>
          Front
        </button>
        <button type="button" onClick={() => api.current.turnTo?.(true)}>
          Back
        </button>
      </div>
    </div>
  );
}
