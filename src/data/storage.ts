import * as SQLite from "expo-sqlite";

export type Trace = {
  id: string;
  text: string;
  preview: string;
  createdAt: string;
  source: "main_input";
};

const DB_NAME = "unhappened.db";
const HOLD_SOURCE = "main_input";
let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

function createId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function getPreview(text: string): string {
  const compact = text.replace(/\s+/g, " ").trim();
  if (!compact) return "";
  const words = compact.split(" ");
  if (words.length <= 7) return compact;
  return `${words.slice(0, 7).join(" ")}...`;
}

async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await SQLite.openDatabaseAsync(DB_NAME);
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS traces (
          id TEXT PRIMARY KEY NOT NULL,
          text TEXT NOT NULL,
          preview TEXT NOT NULL,
          created_at TEXT NOT NULL,
          source TEXT NOT NULL DEFAULT 'main_input'
        );
      `);
      await db.execAsync(
        "CREATE INDEX IF NOT EXISTS idx_traces_created_at ON traces(created_at DESC);",
      );
      return db;
    })();
  }
  return dbPromise;
}

export async function initStorage(): Promise<void> {
  await getDb();
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

  const db = await getDb();
  await db.runAsync(
    `INSERT INTO traces (id, text, preview, created_at, source)
     VALUES (?, ?, ?, ?, ?)`,
    trace.id,
    trace.text,
    trace.preview,
    trace.createdAt,
    trace.source,
  );

  return trace;
}

export async function listTraces(): Promise<Trace[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<Trace>(
    `SELECT id, text, preview, created_at AS createdAt, source
     FROM traces
     ORDER BY created_at DESC`,
  );
  return rows;
}
