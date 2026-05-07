import { useState } from "react";
import { fetchRepoDetail } from "../services/api";

interface Props {
  owner: string;
  name: string;
}

export function ReadmePreview({ owner, name }: Props) {
  const [open, setOpen] = useState(false);
  const [readme, setReadme] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    if (open) {
      setOpen(false);
      return;
    }
    if (readme !== null) {
      setOpen(true);
      return;
    }
    setLoading(true);
    try {
      const detail = await fetchRepoDetail(owner, name);
      setReadme(detail.readme);
      setOpen(true);
    } catch {
      setReadme(null);
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={toggle}
        style={{
          background: "none",
          border: "1px solid #444",
          borderRadius: "8px",
          padding: "8px 16px",
          color: "#a0a0b8",
          cursor: "pointer",
          fontSize: "13px",
          width: "100%",
        }}
      >
        {loading ? "Loading README..." : open ? "Hide README" : "Show README Preview"}
      </button>
      {open && readme && (
        <pre
          style={{
            marginTop: "8px",
            padding: "12px",
            borderRadius: "8px",
            background: "#111122",
            color: "#c0c0d8",
            fontSize: "12px",
            lineHeight: 1.5,
            maxHeight: "300px",
            overflow: "auto",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {readme}
        </pre>
      )}
      {open && !readme && !loading && (
        <p style={{ color: "#666", fontSize: "13px", marginTop: "8px" }}>No README available</p>
      )}
    </div>
  );
}