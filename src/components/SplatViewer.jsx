import { useEffect, useRef, useState } from "react";
import { Splat, Html, Environment } from "@react-three/drei";
import useFitCameraToBox from "../utils/useFitCameraToBox";

function LoaderOverlay() {
  return (
    <Html center>
      <div style={{
        padding: "10px 14px",
        borderRadius: 12,
        background: "rgba(0,0,0,.6)",
        color: "white",
        fontWeight: 600,
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial"
      }}>
        Loading…
      </div>
    </Html>
  );
}

export default function SplatViewer({
  src,
  rotation = [0, 0, 0],
  position = [0, 0, 0],
  scale = 1,
  visible = true
}) {
  const groupRef = useRef();
  const [ready, setReady] = useState(false);
  const fit = useFitCameraToBox(1.3);

  useEffect(() => {
    const t = setTimeout(() => groupRef.current && fit(groupRef.current), 50);
    return () => clearTimeout(t);
  }, [src, fit]);

  useEffect(() => {
    if (ready) fit(groupRef.current);
  }, [ready, fit]);

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale} visible={visible}>
      <Environment preset="city" />
      <Splat src={src} onLoaded={() => setReady(true)} />
      {!ready && <LoaderOverlay />}
    </group>
  );
}
