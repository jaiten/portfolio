"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/* A stylised body built from primitives. Each part carries the region it
   reports when clicked; the torso splits front and back so a tap on the
   back of the lower torso reads as the lower back. */

const BASE = new THREE.Color("#c9d3e0");
const HOVER = new THREE.Color("#9fd3e8");
const PICK = new THREE.Color("#ff7a59");

function capsule(r, len, x, y, z, region, rot = 0) {
  const m = new THREE.Mesh(new THREE.CapsuleGeometry(r, len, 8, 20), new THREE.MeshStandardMaterial({ color: BASE.clone(), roughness: 0.55, metalness: 0.05 }));
  m.position.set(x, y, z);
  m.rotation.z = rot;
  m.userData.region = region;
  return m;
}
function sphere(r, x, y, z, region) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, 28, 20), new THREE.MeshStandardMaterial({ color: BASE.clone(), roughness: 0.55, metalness: 0.05 }));
  m.position.set(x, y, z);
  m.userData.region = region;
  return m;
}

export default function OrcaBody({ selected, onPick }) {
  const mount = useRef(null);
  const api = useRef({});
  const pickRef = useRef(onPick);
  pickRef.current = onPick;

  useEffect(() => {
    const el = mount.current;
    const w = el.clientWidth;
    const h = el.clientHeight;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, w / h, 0.1, 100);
    camera.position.set(0, -0.15, 9.4);

    scene.add(new THREE.HemisphereLight("#ffffff", "#334055", 1.6));
    const key = new THREE.DirectionalLight("#ffffff", 1.6);
    key.position.set(3, 4, 5);
    scene.add(key);
    const rim = new THREE.DirectionalLight("#8fd3ff", 1.1);
    rim.position.set(-4, 2, -4);
    scene.add(rim);

    const body = new THREE.Group();
    const parts = [
      sphere(0.36, 0, 1.78, 0, "head"),
      capsule(0.12, 0.12, 0, 1.36, 0, "neck"),
      // torso: chest and abdomen, each split into a front and a back half
      capsule(0.5, 0.35, 0, 0.88, 0.001, "chest"),
      capsule(0.44, 0.3, 0, 0.18, 0.001, "abdomen"),
      sphere(0.42, 0, -0.32, 0, "hip"),
      sphere(0.2, -0.62, 1.12, 0, "shoulder"),
      sphere(0.2, 0.62, 1.12, 0, "shoulder"),
      capsule(0.13, 0.55, -0.78, 0.62, 0, "arm", -0.18),
      capsule(0.13, 0.55, 0.78, 0.62, 0, "arm", 0.18),
      capsule(0.11, 0.5, -0.92, -0.18, 0.05, "arm", -0.1),
      capsule(0.11, 0.5, 0.92, -0.18, 0.05, "arm", 0.1),
      capsule(0.18, 0.62, -0.24, -0.98, 0, "leg"),
      capsule(0.18, 0.62, 0.24, -0.98, 0, "leg"),
      sphere(0.17, -0.24, -1.5, 0.02, "knee"),
      sphere(0.17, 0.24, -1.5, 0.02, "knee"),
      capsule(0.14, 0.62, -0.24, -2.05, 0, "leg"),
      capsule(0.14, 0.62, 0.24, -2.05, 0, "leg")
    ];
    parts.forEach((p) => body.add(p));
    body.position.y = 0.25;
    body.scale.setScalar(0.92);
    scene.add(body);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.minPolarAngle = Math.PI / 2 - 0.35;
    controls.maxPolarAngle = Math.PI / 2 + 0.35;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.4;
    controls.addEventListener("start", () => (controls.autoRotate = false));

    const ray = new THREE.Raycaster();
    const ptr = new THREE.Vector2();
    let hovered = null;
    let down = null;

    // Front or back of the torso, judged in the body's own space.
    const regionOf = (hit) => {
      const r = hit.object.userData.region;
      if (r !== "chest" && r !== "abdomen") return r;
      const local = body.worldToLocal(hit.point.clone());
      if (local.z < 0) return r === "chest" ? "upper back" : "lower back";
      return r;
    };
    const cast = (e) => {
      const b = renderer.domElement.getBoundingClientRect();
      ptr.set(((e.clientX - b.left) / b.width) * 2 - 1, -((e.clientY - b.top) / b.height) * 2 + 1);
      ray.setFromCamera(ptr, camera);
      return ray.intersectObjects(parts)[0] || null;
    };
    const onMove = (e) => {
      const hit = cast(e);
      hovered = hit ? regionOf(hit) : null;
      renderer.domElement.style.cursor = hit ? "pointer" : "grab";
    };
    const onDown = (e) => (down = { x: e.clientX, y: e.clientY });
    const onUp = (e) => {
      if (!down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 5) return;
      const hit = cast(e);
      if (hit) {
        controls.autoRotate = false;
        pickRef.current(regionOf(hit));
      }
    };
    const onLeave = () => (hovered = null);
    renderer.domElement.addEventListener("pointermove", onMove);
    renderer.domElement.addEventListener("pointerdown", onDown);
    renderer.domElement.addEventListener("pointerup", onUp);
    renderer.domElement.addEventListener("pointerleave", onLeave);

    const part = (mesh) => {
      const r = mesh.userData.region;
      return r === "chest" || r === "abdomen" ? [r, r === "chest" ? "upper back" : "lower back"] : [r];
    };
    let raf;
    let visible = true;
    const io = new IntersectionObserver(([en]) => (visible = en.isIntersecting));
    io.observe(el);
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      controls.update();
      const sel = api.current.selected;
      parts.forEach((m) => {
        const names = part(m);
        const target = names.includes(sel) ? PICK : names.includes(hovered) ? HOVER : BASE;
        m.material.color.lerp(target, 0.18);
        m.material.emissive.copy(names.includes(sel) ? PICK : new THREE.Color(0)).multiplyScalar(names.includes(sel) ? 0.25 : 0);
      });
      renderer.render(scene, camera);
    };
    tick();

    const ro = new ResizeObserver(() => {
      const nw = el.clientWidth;
      const nh = el.clientHeight;
      renderer.setSize(nw, nh);
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
    });
    ro.observe(el);

    api.current.turnTo = (back) => {
      controls.autoRotate = false;
      const a = back ? Math.PI : 0;
      const d = camera.position.length();
      camera.position.set(Math.sin(a) * d, -0.15, Math.cos(a) * d);
      controls.update();
    };

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      controls.dispose();
      parts.forEach((m) => {
        m.geometry.dispose();
        m.material.dispose();
      });
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
