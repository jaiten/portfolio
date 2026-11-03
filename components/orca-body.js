"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/* A rigged human mannequin (/models/body.glb, slimmed to its idle pose) under
   studio lighting. A tap is mapped to a body region by the nearest bone, and
   the area glows on the skin itself: coral where you tapped, cyan on hover. */

const BONE = (n) => `mixamorig${n}`;
// [from, to, region]; torso regions split front/back by the side of the body that was hit.
const SEGMENTS = [
  ["Head", "HeadTop_End", "head"],
  ["Neck", "Head", "neck"],
  ["Spine2", "Neck", "chest"],
  ["Spine", "Spine2", "abdomen"],
  ["Hips", "Spine", "abdomen"],
  ["Hips", "LeftUpLeg", "hip"],
  ["Hips", "RightUpLeg", "hip"],
  ["LeftShoulder", "LeftArm", "shoulder"],
  ["RightShoulder", "RightArm", "shoulder"],
  ["LeftArm", "LeftForeArm", "arm"],
  ["RightArm", "RightForeArm", "arm"],
  ["LeftForeArm", "LeftHand", "arm"],
  ["RightForeArm", "RightHand", "arm"],
  ["LeftHand", "LeftHandMiddle2", "arm"],
  ["RightHand", "RightHandMiddle2", "arm"],
  ["LeftUpLeg", "LeftLeg", "leg"],
  ["RightUpLeg", "RightLeg", "leg"],
  ["LeftLeg", "LeftFoot", "leg"],
  ["RightLeg", "RightFoot", "leg"],
  ["LeftFoot", "LeftToeBase", "leg"],
  ["RightFoot", "RightToeBase", "leg"]
];
const KNEES = ["LeftLeg", "RightLeg"];
// Where to glow when a region is chosen from the list instead of tapped.
const ANCHOR = {
  head: ["Head", "HeadTop_End", 0.5, 0.09],
  neck: ["Neck", "Head", 0.4, 0.05],
  chest: ["Spine2", "Neck", 0.25, 0.13],
  "upper back": ["Spine2", "Neck", 0.25, -0.12],
  abdomen: ["Spine", "Spine1", 0.3, 0.13],
  "lower back": ["Hips", "Spine", 0.7, -0.12],
  shoulder: ["RightShoulder", "RightArm", 0.9, 0.02],
  arm: ["RightForeArm", "RightHand", 0.4, 0.03],
  hip: ["Hips", "RightUpLeg", 1, 0.04],
  leg: ["RightUpLeg", "RightLeg", 0.5, 0.07],
  knee: ["RightLeg", "RightLeg", 0, 0.07]
};

const AB = new THREE.Vector3();
const AP = new THREE.Vector3();
const closestOnSegment = (p, a, b, out) => {
  AB.subVectors(b, a);
  const t = THREE.MathUtils.clamp(AP.subVectors(p, a).dot(AB) / Math.max(AB.lengthSq(), 1e-6), 0, 1);
  return out.copy(a).addScaledVector(AB, t);
};

function skinMaterial(color) {
  const mat = new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.48,
    metalness: 0,
    sheen: 0.6,
    sheenRoughness: 0.6,
    sheenColor: new THREE.Color("#ffd8c8"),
    clearcoat: 0.12,
    clearcoatRoughness: 0.6
  });
  mat.userData.uniforms = {
    uPick: { value: new THREE.Vector3(0, -99, 0) },
    uHover: { value: new THREE.Vector3(0, -99, 0) },
    uPickOn: { value: 0 },
    uHoverOn: { value: 0 },
    uTime: { value: 0 }
  };
  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, mat.userData.uniforms);
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vOrcaPos;")
      .replace("#include <project_vertex>", "#include <project_vertex>\nvOrcaPos = (modelMatrix * vec4(transformed, 1.0)).xyz;");
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        "#include <common>\nvarying vec3 vOrcaPos;\nuniform vec3 uPick;\nuniform vec3 uHover;\nuniform float uPickOn;\nuniform float uHoverOn;\nuniform float uTime;"
      )
      .replace(
        "#include <opaque_fragment>",
        `#include <opaque_fragment>
        float dp = distance(vOrcaPos, uPick);
        float pulse = 0.85 + 0.15 * sin(uTime * 3.0);
        float hp = (1.0 - smoothstep(0.02, 0.15, dp)) * uPickOn;
        float hh = (1.0 - smoothstep(0.0, 0.12, distance(vOrcaPos, uHover))) * uHoverOn;
        gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.55, 0.85, 0.95), hh * 0.45);
        vec3 hot = vec3(1.0, 0.27, 0.16);
        gl_FragColor.rgb = mix(gl_FragColor.rgb, hot, clamp(hp * pulse, 0.0, 1.0));
        gl_FragColor.rgb += hot * hp * 0.25;`
      );
  };
  return mat;
}

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
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = 0.55;

    const camera = new THREE.PerspectiveCamera(28, el.clientWidth / el.clientHeight, 0.05, 50);
    camera.position.set(0, 1.02, 4.05);

    const key = new THREE.DirectionalLight("#fff4ea", 2.2);
    key.position.set(2.2, 3.5, 3);
    const fill = new THREE.DirectionalLight("#cfe3ff", 0.6);
    fill.position.set(-3, 1.5, 2);
    const rim = new THREE.DirectionalLight("#8fd3ff", 1.6);
    rim.position.set(-1.5, 2.5, -3.5);
    scene.add(key, fill, rim, new THREE.HemisphereLight("#ffffff", "#2a3a4f", 0.5));

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
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 0.75), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }));
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.002;
    scene.add(shadow);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.92, 0);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.minPolarAngle = Math.PI / 2 - 0.4;
    controls.maxPolarAngle = Math.PI / 2 + 0.15;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.2;
    controls.addEventListener("start", () => (controls.autoRotate = false));
    controls.update();

    const mats = [skinMaterial("#e8dacf"), skinMaterial("#d6c5b8")];
    const meshes = [];
    const bones = {};
    let mixer = null;

    new GLTFLoader().load("/models/body.glb", (gltf) => {
      if (disposed) return;
      const model = gltf.scene;
      model.traverse((o) => {
        if (o.isBone) bones[o.name.replace("mixamorig:", "mixamorig")] = o;
        if (o.isMesh) {
          o.material = o.name.includes("Joints") ? mats[1] : mats[0];
          o.frustumCulled = false;
          meshes.push(o);
        }
      });
      scene.add(model);
      const idle = gltf.animations.find((a) => a.name === "idle");
      if (idle) {
        mixer = new THREE.AnimationMixer(model);
        mixer.clipAction(idle).play();
        mixer.update(0.5);
      }
      el.classList.add("is-ready");
      if (api.current.selected) api.current.anchor(api.current.selected);
    });

    const pos = (name, out) => (bones[BONE(name)] ? bones[BONE(name)].getWorldPosition(out) : null);
    const A = new THREE.Vector3();
    const B = new THREE.Vector3();
    const Q = new THREE.Vector3();

    const regionAt = (p) => {
      // Knees first: a small sphere around each knee joint.
      for (const k of KNEES) if (pos(k, A) && A.distanceTo(p) < 0.085) return "knee";
      for (const k of ["LeftArm", "RightArm"]) if (pos(k, A) && A.distanceTo(p) < 0.08) return "shoulder";
      let best = null;
      let bestD = Infinity;
      let side = 0;
      for (const [f, t, r] of SEGMENTS) {
        if (!pos(f, A) || !pos(t, B)) continue;
        closestOnSegment(p, A, B, Q);
        const d = Q.distanceTo(p);
        if (d < bestD) {
          bestD = d;
          best = r;
          side = p.z - Q.z;
        }
      }
      if (best === "chest" && side < 0) return "upper back";
      if (best === "abdomen" && side < 0) return "lower back";
      return best;
    };

    api.current.anchor = (region) => {
      const a = ANCHOR[region];
      if (!a || !pos(a[0], A) || !pos(a[1], B)) return;
      const p = A.lerp(B, a[2]);
      p.z += a[3];
      mats.forEach((m) => {
        m.userData.uniforms.uPick.value.copy(p);
        m.userData.uniforms.uPickOn.value = 1;
      });
    };
    api.current.clear = () => mats.forEach((m) => (m.userData.uniforms.uPickOn.value = 0));

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
      const region = regionAt(hit.point);
      mats.forEach((m) => {
        m.userData.uniforms.uPick.value.copy(hit.point);
        m.userData.uniforms.uPickOn.value = 1;
      });
      api.current.tapped = region;
      pickRef.current(region);
    };
    const onLeave = () => {
      pending = null;
      mats.forEach((m) => (m.userData.uniforms.uHoverOn.value = 0));
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
      const dt = clock.getDelta();
      if (!visible) return;
      if (mixer) mixer.update(dt);
      if (pending && meshes.length) {
        const hit = cast(pending);
        renderer.domElement.style.cursor = hit ? "pointer" : "grab";
        mats.forEach((m) => {
          if (hit) m.userData.uniforms.uHover.value.copy(hit.point);
          m.userData.uniforms.uHoverOn.value = hit ? 1 : 0;
        });
        pending = null;
      }
      const t = clock.elapsedTime;
      mats.forEach((m) => (m.userData.uniforms.uTime.value = t));
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
      controls.autoRotate = false;
      const d = camera.position.distanceTo(controls.target);
      camera.position.set(0, controls.target.y + 0.12, back ? -d : d);
      controls.update();
    };

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      controls.dispose();
      mats.forEach((m) => m.dispose());
      meshes.forEach((m) => m.geometry.dispose());
      shadow.geometry.dispose();
      shadow.material.dispose();
      shadowTex.dispose();
      env.dispose();
      pmrem.dispose();
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, []);

  // A region chosen from the list (not tapped) glows at its anchor point.
  useEffect(() => {
    api.current.selected = selected;
    if (!selected) api.current.clear?.();
    else if (api.current.tapped !== selected) api.current.anchor?.(selected);
    api.current.tapped = null;
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
