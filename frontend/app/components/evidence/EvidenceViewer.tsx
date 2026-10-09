import React from "react";
interface Chunk { id?: string; chunk_id?: string; type?: string; page?: number; score?: number; src?: string; data?: unknown }
export default function EvidenceViewer({ chunks = [] as Chunk[] }) {
  return (
    <div className="evidence-viewer">
      <h3>Evidence — Multimodal Sources</h3>
      {chunks.length === 0 ? <p>No evidence.</p> : chunks.map((c) => (
        <div key={c.id || c.chunk_id} style={{ border: "1px solid #ccc", margin: 8, padding: 8 }}>
          <b>Type:</b> {c.type || "text"} | <b>Page:</b> {c.page ?? "-"} | <b>Score:</b> {c.score ?? "-"}
          <br />
          {c.type === "image" || c.type === "image_ocr" ? (
            <img src={c.src || "/placeholder.png"} alt="evidence" style={{ maxWidth: 300 }} />
          ) : (
            <pre style={{ fontSize: 12 }}>{JSON.stringify(c.data || c, null, 2).slice(0, 500)}</pre>
          )}
        </div>
      ))}
    </div>
  );
}
