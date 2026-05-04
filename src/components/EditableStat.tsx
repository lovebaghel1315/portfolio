import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Stat } from "../types";

type Props = {
  stat: Stat;
  isAdmin: boolean;
  accent: string;
  onChange: (s: Stat) => void;
};

export default function EditableStat({ stat, isAdmin, accent, onChange }: Props) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(stat.value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setVal(stat.value);
  }, [stat.value]);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  function commit() {
    if (val.trim()) onChange({ ...stat, value: val.trim() });
    setEditing(false);
  }

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 18 }}
      className="group relative overflow-hidden rounded-2xl border border-white/60 bg-white/70 p-3 shadow-sm backdrop-blur-xl"
    >
      <div
        className={`pointer-events-none absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-gradient-to-br ${accent} opacity-20 blur-2xl`}
      />

      {/* gradient icon line */}
      <div className={`mb-2 h-1 w-8 rounded-full bg-gradient-to-r ${accent}`} />

      {editing ? (
        <input
          ref={inputRef}
          type="text"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") setEditing(false);
          }}
          className="w-full rounded border border-indigo-300 bg-white px-1 text-xl font-bold text-zinc-900 outline-none"
        />
      ) : (
        <motion.div
          onClick={() => isAdmin && setEditing(true)}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`text-2xl font-bold leading-none bg-gradient-to-r ${accent} bg-clip-text text-transparent ${
            isAdmin ? "cursor-pointer" : ""
          }`}
          title={isAdmin ? "Click to edit" : ""}
        >
          {stat.value}
        </motion.div>
      )}
      <div className="mt-1.5 text-[10.5px] font-medium uppercase tracking-wider text-zinc-500">
        {stat.label}
      </div>
    </motion.div>
  );
}
