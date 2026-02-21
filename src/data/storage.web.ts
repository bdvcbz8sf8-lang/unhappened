import { getPreview } from "../features/traces/preview";

export type Trace = {
  id: string;
  text: string;
  preview: string;
  createdAt: string;
  source: "main_input";
};

const STORAGE_KEY = "unhappened_traces_v1";
const HOLD_SOURCE = "main_input";
let memoryFallback: Trace[] = [];

function createId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function canUseLocalStorage(): boolean {
  try {
    return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
  } catch {
    return false;
  }
}

function readTraces(): Trace[] {
  if (!canUseLocalStorage()) return [...memoryFallback];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Trace[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeTraces(traces: Trace[]): void {
  if (!canUseLocalStorage()) {
    memoryFallback = [...traces];
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(traces));
}

export async function initStorage(): Promise<void> {
  return;
}

export async function createTrace(text: string): Promise<Trace | null> {
  const trimmed = text.trim();
  if (!trimmed) return null;

  const trace: Trace = {
    id: createId(),
    text: trimmed,
    preview: getPreview(trimmed),
    createdAt: new Date().toISOString(),
    source: HOLD_SOURCE,
  };

  const traces = readTraces();
  traces.unshift(trace);
  writeTraces(traces);
  return trace;
}

export async function listTraces(): Promise<Trace[]> {
  return readTraces().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function deleteTrace(id: string): Promise<void> {
  const traces = readTraces().filter((trace) => trace.id !== id);
  writeTraces(traces);
}
