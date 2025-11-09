import { useRef } from "react";

export default function SplatPicker({ value, onChange }) {
  const inputRef = useRef(null);

  function onFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    onChange(url);
  }

  return (
    <div style={{
      position: "fixed", left: 16, bottom: 16, zIndex: 1000,
      display: "flex", gap: 8, alignItems: "center",
      fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial"
    }}>
      <button
        onClick={() => inputRef.current?.click()}
        style={{ padding: "8px 12px", borderRadius: 10, border: "1px solid rgba(0,0,0,.15)" }}
        title="Load a .splat file from your device"
      >
        Load .splat
      </button>
      <button
        onClick={() => onChange("/splats/example.splat")}
        style={{ padding: "8px 12px", borderRadius: 10, border: "1px solid rgba(0,0,0,.15)" }}
        title="Use sample .splat from /public/splats"
      >
        Use sample
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".splat"
        onChange={onFile}
        style={{ display: "none" }}
      />
    </div>
  );
}
