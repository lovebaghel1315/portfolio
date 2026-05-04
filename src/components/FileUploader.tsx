import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { StoredFile } from "../types";
import {
  ALLOWED_ACCEPT,
  fileToDataUrl,
  isAllowedFile,
  loadFiles,
  saveFiles,
} from "../storage";

type Props = {
  category: string;
  label: string;
  hint: string;
  icon: string;
  accent: string; // tailwind gradient classes e.g. "from-indigo-500 to-violet-500"
  isAdmin: boolean;
  files: StoredFile[];
  onChange: (files: StoredFile[]) => void;
};

function fileIcon(name: string) {
  const n = name.toLowerCase();
  if (n.endsWith(".pdf")) return "📕";
  if (n.endsWith(".xls") || n.endsWith(".xlsx") || n.endsWith(".csv")) return "📊";
  if (n.endsWith(".ppt") || n.endsWith(".pptx")) return "📽️";
  if (n.endsWith(".doc") || n.endsWith(".docx")) return "📄";
  if (n.endsWith(".png") || n.endsWith(".jpg") || n.endsWith(".jpeg")) return "🖼️";
  return "📎";
}

function formatSize(b: number) {
  if (b < 1024) return b + " B";
  if (b < 1024 * 1024) return (b / 1024).toFixed(1) + " KB";
  return (b / 1024 / 1024).toFixed(2) + " MB";
}

export default function FileUploader({
  category,
  label,
  hint,
  icon,
  accent,
  isAdmin,
  files,
  onChange,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);

  const myFiles = files.filter((f) => f.category === category);

  async function handleFiles(list: FileList | null) {
    if (!list || list.length === 0) return;
    setBusy(true);
    const all = loadFiles();
    for (const f of Array.from(list)) {
      if (!isAllowedFile(f)) {
        alert(`❌ ${f.name} — not an allowed file type.`);
        continue;
      }
      if (f.size > 4 * 1024 * 1024) {
        alert(`❌ ${f.name} — too large (>4MB).`);
        continue;
      }
      try {
        const dataUrl = await fileToDataUrl(f);
        all.push({
          id: crypto.randomUUID(),
          name: f.name,
          type: f.type,
          size: f.size,
          category,
          dataUrl,
          uploadedAt: Date.now(),
        });
      } catch {
        alert(`Failed to read ${f.name}`);
      }
    }
    try {
      saveFiles(all);
      onChange(all);
    } catch {
      // already alerted
    }
    setBusy(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function remove(id: string) {
    const all = loadFiles().filter((f) => f.id !== id);
    saveFiles(all);
    onChange(all);
  }

  function openFile(f: StoredFile) {
    // Open in new tab — works for PDFs and images. For office files this triggers download.
    const w = window.open();
    if (w) {
      w.document.write(
        `<title>${f.name}</title><iframe src="${f.dataUrl}" style="border:0;width:100vw;height:100vh"></iframe>`
      );
    }
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative overflow-hidden rounded-2xl border border-white/60 bg-white/70 p-4 shadow-sm backdrop-blur-xl"
    >
      {/* gradient glow */}
      <div
        className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${accent} opacity-20 blur-2xl transition-opacity group-hover:opacity-40`}
      />

      <div className="relative mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${accent} text-base shadow-md`}
          >
            <span>{icon}</span>
          </div>
          <div>
            <div className="text-sm font-semibold text-zinc-900">{label}</div>
            <div className="text-[11px] text-zinc-500">{hint}</div>
          </div>
        </div>
        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600">
          {myFiles.length}
        </span>
      </div>

      {/* Google Drive Button — always visible */}
      <a
        href="https://drive.google.com/drive/folders/1VsK9ntMnGY-6oUsSAs1gmtTeudstKkM1?usp=sharing"
        target="_blank"
        rel="noopener noreferrer"
        className={`mb-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${accent} px-3 py-2 text-xs font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg`}
      >
        <svg width="14" height="14" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg" fill="white">
          <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z"/>
          <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z"/>
          <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z"/>
          <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z"/>
          <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z"/>
          <path d="m73.4 26.3-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z"/>
        </svg>
        View on Google Drive
      </a>

      {/* Admin upload zone */}
      {isAdmin && (
        <motion.div
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            handleFiles(e.dataTransfer.files);
          }}
          onClick={() => inputRef.current?.click()}
          whileTap={{ scale: 0.98 }}
          className={`mb-2 cursor-pointer rounded-xl border-2 border-dashed p-3 text-center transition-all ${
            drag
              ? "border-indigo-500 bg-indigo-50"
              : "border-zinc-300 hover:border-indigo-400 hover:bg-indigo-50/50"
          }`}
        >
          <div className="flex flex-col items-center gap-1">
            <motion.div
              animate={busy ? { rotate: 360 } : {}}
              transition={{ repeat: busy ? Infinity : 0, duration: 1, ease: "linear" }}
              className="text-xl"
            >
              {busy ? "⏳" : "⬆️"}
            </motion.div>
            <div className="text-xs font-medium text-zinc-700">
              {busy ? "Uploading…" : "Click or drop files here"}
            </div>
            <div className="text-[10px] text-zinc-400">PDF · DOC · XLS · PPT · IMG · max 4MB</div>
          </div>
        </motion.div>
      )}

      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ALLOWED_ACCEPT}
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      {/* file list */}
      {myFiles.length === 0 ? (
        !isAdmin && (
          <div className="rounded-lg border border-dashed border-zinc-200 px-3 py-3 text-center text-xs text-zinc-400">
            No files uploaded yet
          </div>
        )
      ) : (
        <ul className="space-y-1.5">
          <AnimatePresence initial={false}>
            {myFiles.map((f) => (
              <motion.li
                key={f.id}
                layout
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -10 }}
                whileHover={{ x: 2 }}
                className="group/item flex items-center justify-between gap-2 rounded-lg bg-gradient-to-r from-zinc-50 to-white px-2.5 py-1.5 ring-1 ring-zinc-200/60 transition-all hover:ring-indigo-300"
              >
                <button
                  onClick={() => openFile(f)}
                  className="flex min-w-0 flex-1 items-center gap-2 text-left"
                >
                  <span className="text-base">{fileIcon(f.name)}</span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-medium text-zinc-800 group-hover/item:text-indigo-600">
                      {f.name}
                    </div>
                    <div className="text-[10px] text-zinc-400">
                      {formatSize(f.size)} · {new Date(f.uploadedAt).toLocaleDateString()}
                    </div>
                  </div>
                </button>
                <a
                  href={f.dataUrl}
                  download={f.name}
                  className="rounded-md p-1 text-zinc-400 transition-colors hover:bg-indigo-100 hover:text-indigo-600"
                  title="Download"
                >
                  ⬇
                </a>
                {isAdmin && (
                  <button
                    onClick={() => remove(f.id)}
                    className="rounded-md p-1 text-zinc-400 transition-colors hover:bg-red-100 hover:text-red-600"
                    title="Delete"
                  >
                    ✕
                  </button>
                )}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </motion.div>
  );
}





