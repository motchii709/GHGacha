import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchRepoDetail } from "../services/api";

interface Props {
  owner: string;
  name: string;
  rarityColor: string;
}

export function ReadmePreview({ owner, name, rarityColor }: Props) {
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
      <motion.button
        onClick={toggle}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        style={{
          width: "100%",
          padding: "10px 14px",
          borderRadius: "var(--radius-sm)",
          background: "rgba(0,0,0,0.02)",
          border: `1px solid ${rarityColor}22`,
          color: "var(--text-secondary)",
          cursor: "pointer",
          fontSize: "12px",
          fontFamily: "var(--font-body)",
          transition: "border-color 0.2s",
        }}
      >
        {loading ? "LOADING README..." : open ? "HIDE README" : "SHOW README PREVIEW"}
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: "hidden" }}
          >
            {readme ? (
              <pre
                style={{
                  marginTop: "8px",
                  padding: "14px",
                  borderRadius: "var(--radius-sm)",
                  background: "#f8f8fc",
                  color: "var(--text-secondary)",
                  fontSize: "12px",
                  lineHeight: 1.6,
                  maxHeight: "260px",
                  overflow: "auto",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  border: `1px solid ${rarityColor}11`,
                }}
              >
                {readme}
              </pre>
            ) : (
              <p style={{ color: "var(--text-muted)", fontSize: "12px", marginTop: "8px", textAlign: "center" }}>
                No README available
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}