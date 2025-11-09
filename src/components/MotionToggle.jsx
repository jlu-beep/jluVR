// src/components/MotionToggle.jsx
import { useEffect, useState } from "react";

function isiOS() {
  if (typeof navigator === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
         (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}
function isMobile() {
  if (typeof navigator === "undefined") return false;
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export default function MotionToggle({ enabled, onChange }) {
  const [supported, setSupported] = useState(true);
  const [httpsOk, setHttpsOk] = useState(true);

  useEffect(() => {
    setHttpsOk(window.isSecureContext === true);
    setSupported("DeviceOrientationEvent" in window);
  }, []);

  async function requestPermissionIfNeeded() {
    const DME = window.DeviceMotionEvent;
    const DOE = window.DeviceOrientationEvent;

    if (isiOS() && (DME?.requestPermission || DOE?.requestPermission)) {
      try {
        if (DOE?.requestPermission) {
          const res = await DOE.requestPermission();
          if (res !== "granted") throw new Error("Permission not granted");
        } else if (DME?.requestPermission) {
          const res = await DME.requestPermission();
          if (res !== "granted") throw new Error("Permission not granted");
        }
      } catch (e) {
        console.warn("Motion permission error:", e);
        return;
      }
    }
    onChange(!enabled);
  }

  if (!isMobile()) return null;

  return (
    <div style={{
      position: "fixed",
      right: 16,
      bottom: 16,
      zIndex: 1000,
      display: "flex",
      gap: 8,
      alignItems: "center",
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif"
    }}>
      {!httpsOk && (
        <span style={{ fontSize: 12, opacity: 0.8 }}>
          Requires HTTPS for sensors
        </span>
      )}
      {supported ? (
        <button
          onClick={requestPermissionIfNeeded}
          style={{
            padding: "10px 14px",
            borderRadius: 12,
            border: "1px solid rgba(0,0,0,.15)",
            background: enabled ? "rgba(0, 180, 90, .15)" : "rgba(0,0,0,.05)",
            backdropFilter: "blur(6px)",
            fontWeight: 600
          }}
          title="Toggle Magic Window (device orientation)"
        >
          {enabled ? "Magic Window: ON" : "Magic Window: OFF"}
        </button>
      ) : (
        <span style={{ fontSize: 12, opacity: 0.8 }}>
          Motion sensors not supported
        </span>
      )}
    </div>
  );
}