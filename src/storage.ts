import type { StoredFile, Stat } from "./types";

const FILES_KEY = "lb_portfolio_files_v1";
const STATS_KEY = "lb_portfolio_stats_v1";
const ADMIN_KEY = "lb_portfolio_admin_v1";

// Simple admin code — change this to whatever you want.
export const ADMIN_CODE = "Love@1234";

export function isAdmin(): boolean {
  return localStorage.getItem(ADMIN_KEY) === "1";
}

export function setAdmin(on: boolean) {
  if (on) localStorage.setItem(ADMIN_KEY, "1");
  else localStorage.removeItem(ADMIN_KEY);
}

export function loadFiles(): StoredFile[] {
  try {
    const raw = localStorage.getItem(FILES_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveFiles(files: StoredFile[]) {
  try {
    localStorage.setItem(FILES_KEY, JSON.stringify(files));
  } catch (e) {
    alert("Storage limit reached. Try removing some files.");
    throw e;
  }
}

export function loadStats(defaults: Stat[]): Stat[] {
  // Always use defaults from code so numbers are consistent on every device.
  // Admin edits are applied in-session only (not persisted across devices).
  return defaults;
}

export function saveStats(stats: Stat[]) {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Allowed MIME / extension list
export const ALLOWED_EXT = [
  ".pdf",
  ".xls",
  ".xlsx",
  ".csv",
  ".ppt",
  ".pptx",
  ".doc",
  ".docx",
  ".jpg",
  ".jpeg",
  ".png",
];
export const ALLOWED_ACCEPT = ALLOWED_EXT.join(",");

export function isAllowedFile(file: File): boolean {
  const name = file.name.toLowerCase();
  return ALLOWED_EXT.some((ext) => name.endsWith(ext));
}

