import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { useEffect, useState, Suspense } from "react";
import { VRButton } from "three/examples/jsm/webxr/VRButton.js";

import GyroLook from "./components/GyroLook";
import MotionToggle from "./components/MotionToggle";
import SplatViewer from "./components/SplatViewer";
import SplatPicker from "./components/SplatPicker";

function EnableXR() {
  const { gl } = require("@react-three/fiber").useThree();
  useEffect(() => {
    gl.xr.enabled = true;
    const btn = VRButton.createButton(gl);
    document.body.appendChild(btn);
    return () => {
      try { document.body.removeChild(btn); } catch {}
    };
  }, [gl]);
  return null;
}

export default function App() {
  const [magicWindow, setMagicWindow] = useState(false);
  const [splatSrc, setSplatSrc] = useState(null);

  return (
    <>
      <Canvas camera={{ position: [0, 1.6, 3], fov: 70 }}>
        <Suspense fallback={null}>
          <EnableXR />
          <Environment preset="city" background={false} />

          <mesh position={[0, 1, 0]} visible={!splatSrc}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#7cc" />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} visible={!splatSrc}>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial color="#222" />
          </mesh>

          <GyroLook enabled={magicWindow} smoothing={0.12} />

          {splatSrc && (
            <SplatViewer
              src={splatSrc}
              rotation={[0, 0, 0]}
              position={[0, 0, 0]}
              scale={1}
            />
          )}

          <OrbitControls
            enabled={!magicWindow}
            enablePan={!magicWindow}
            enableDamping
            dampingFactor={0.05}
          />
        </Suspense>
      </Canvas>

      <MotionToggle enabled={magicWindow} onChange={setMagicWindow} />
      <SplatPicker value={splatSrc} onChange={setSplatSrc} />
    </>
  );
}
