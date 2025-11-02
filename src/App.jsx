import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useEffect } from 'react'
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js'

function EnableXR() {
  const { gl } = useThree()
  useEffect(() => {
    gl.xr.enabled = true
    const btn = VRButton.createButton(gl)
    document.body.appendChild(btn)
    return () => {
      try { document.body.removeChild(btn) } catch {}
    }
  }, [gl])
  return null
}

export default function App() {
  return (
    <Canvas camera={{ position: [0, 1.6, 3], fov: 70 }}>
      <EnableXR />

      {/* lights (for StandardMaterial) */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 5, 2]} intensity={0.8} />

      {/* your cube */}
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#7cc" />
      </mesh>

      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#222" />
      </mesh>

      {/* mouse orbit */}
      <OrbitControls enablePan={false} enableDamping dampingFactor={0.05} />
    </Canvas>
  )
}
