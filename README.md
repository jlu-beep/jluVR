# La Trobe 3D Digital Campus Twin Project
## Minimal Web VR Viewer (R3F + Device Motion)

Light-weight starter code for viewing 3D in the browser with React Three Fiber.

Designed to work on desktop (mouse orbit) and on phones using gyroscope (no headset required).

---

### 🚀 Quick Start Guide
1) Install deps
npm i
2) Run dev server
npm run dev

Open the given URL (e.g. http://localhost:5173\), this will open a tab on a browser to host the application.

The "Testing Cube" will appear if a .splat model is not utilised

---

### 📱 Phone Motion (no headset)

Modern mobile browsers require a secure context for sensor access.

https://localhost on your computer is fine for desktop.

If you open the site from your phone over Wi-Fi (e.g. http://192.168.x.x:5173), that’s not secure → no gyro.
Use HTTPS via mkcert or a tunnel (e.g. ngrok, Cloudflare Tunnel).

<br>
Option A: Local HTTPS via mkcert

Install mkcert: https://github.com/FiloSottile/mkcert

In the project root:

mkcert -install
mkcert localhost


This creates localhost.pem and localhost-key.pem.

Configure Vite (vite.config.js):

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'localhost-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'localhost.pem')),
    },
    host: true, // allow LAN devices to connect
  },
})


npm run dev, then on your phone open:

https://<your-computer-LAN-IP>:5173


On iOS, tap the on-screen Enable Motion button when prompted.

Option B: Tunnel (easiest on any network)

Run npm run dev

Start a tunnel (e.g. ngrok http 5173) and open the HTTPS URL on your phone.

Grant motion permission when prompted.

---

### 🧭 Controls

Desktop: Mouse controsl to orbit the scene via OrbitControls; drag with the mouse to move the camera around

Mobile (HTTPS): DeviceOrientationControls rotates the camera with phone movement.

The app shows a small overlay button on iOS to request motion permission (required by Safari).


---


### 🟡 Loading a Gaussian Splat

Put your file under public/splats/, e.g.:

public/splats/scene.splat


Add it to the scene:

import { Splat } from '@react-three/drei'

<Splat src="/splats/scene.splat" position={[0, 1, 0]} />


Check DevTools → Network to confirm /splats/scene.splat returns 200 (not 404).

For large assets, consider Git LFS so your repo stays light.

---

### 📦 Scripts
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}

---

### 🧰 Tech Stack

React 18, Vite 5

three ^0.160

@react-three/fiber, @react-three/drei


---

### 🩺 Troubleshooting

Blank/white screen → Open DevTools → Console; fix the first red error.

No gyroscope on phone → You must use HTTPS when serving to your phone over Wi-Fi.

iOS not moving → Tap Enable Motion (user gesture is required).

Splat 404 → Ensure file is in public/splats/ and the path starts with /splats/....

---

### 🗂️ Git LFS (recommended for assets)
git lfs install
git lfs track "*.splat" "*.glb" "*.gltf" "*.bin" "*.hdr" "*.exr" "*.jpg" "*.png"
git add .gitattributes
git commit -m "chore: track large assets with LFS"

---

### 📄 License

MIT 

