// src/components/GyroLook.jsx
import { useEffect, useRef } from "react";
import { Euler, Quaternion, Vector3, MathUtils } from "three";
import { useFrame, useThree } from "@react-three/fiber";

export default function GyroLook({ enabled = false, smoothing = 0.15 }) {
  const { camera } = useThree();
  const targetQ = useRef(new Quaternion());
  const euler = useRef(new Euler(0, 0, 0, "YXZ"));
  const screenQ = useRef(new Quaternion());
  const tmpQ = useRef(new Quaternion());
  const hasData = useRef(false);

  useEffect(() => {
    function updateScreenQuat() {
      const angle = (window.screen?.orientation?.angle || 0) * Math.PI / 180;
      screenQ.current.setFromAxisAngle(new Vector3(0, 0, 1), -angle);
    }
    updateScreenQuat();
    window.addEventListener("orientationchange", updateScreenQuat);

    function onDeviceOrientation(e) {
      const alpha = MathUtils.degToRad(e.alpha ?? 0);
      const beta  = MathUtils.degToRad(e.beta  ?? 0);
      const gamma = MathUtils.degToRad(e.gamma ?? 0);

      euler.current.set(beta, alpha, -gamma, "YXZ");
      targetQ.current.setFromEuler(euler.current);

      tmpQ.current.setFromAxisAngle(new Vector3(1, 0, 0), -Math.PI / 2);
      targetQ.current.multiply(tmpQ.current);
      targetQ.current.multiply(screenQ.current);

      hasData.current = true;
    }

    if (enabled) {
      window.addEventListener("deviceorientation", onDeviceOrientation, { passive: true });
    }
    return () => {
      window.removeEventListener("deviceorientation", onDeviceOrientation);
      window.removeEventListener("orientationchange", updateScreenQuat);
    };
  }, [enabled]);

  useFrame((_, dt) => {
    if (!enabled || !hasData.current) return;
    const k = 1 - Math.exp(-dt / Math.max(1e-3, smoothing));
    camera.quaternion.slerp(targetQ.current, k);
  });

  return null;
}