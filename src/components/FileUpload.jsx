// src/components/FileUpload.jsx
import React, { useRef, useState } from "react";

export default function FileUpload({ onChange, accept="image/*", preview = true }) {
  const ref = useRef();
  const [src, setSrc] = useState(null);

  function handle(e) {
    const file = e.target.files[0];
    if (!file) { onChange(null); setSrc(null); return; }
    const reader = new FileReader();
    reader.onload = () => {
      setSrc(reader.result);
      onChange(reader.result);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="flex items-center gap-3">
      <input ref={ref} type="file" accept={accept} onChange={handle} />
      {preview && src && <img src={src} alt="preview" className="w-20 h-20 object-cover rounded border" />}
    </div>
  );
}
