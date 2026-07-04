import { mkdir, readFile, readdir, writeFile } from "fs/promises";
import path from "path";

// Durable storage in production (set BLOB_READ_WRITE_TOKEN by attaching a Vercel
// Blob store to the project). Without it, we fall back to local disk so
// `npm run dev` works out of the box — that path is NOT durable on Vercel's
// read-only serverless filesystem and is for local testing only.
const hasBlobToken = !!process.env.BLOB_READ_WRITE_TOKEN;

export function createJsonStore<T extends { id: string }>(collection: string) {
  const localDir = path.join(process.cwd(), ".data", collection);

  async function save(record: T): Promise<void> {
    const json = JSON.stringify(record, null, 2);
    if (hasBlobToken) {
      const { put } = await import("@vercel/blob");
      await put(`${collection}/${record.id}.json`, json, {
        access: "public",
        contentType: "application/json",
        addRandomSuffix: false,
        allowOverwrite: true,
      });
      return;
    }
    await mkdir(localDir, { recursive: true });
    await writeFile(path.join(localDir, `${record.id}.json`), json);
  }

  async function list(): Promise<T[]> {
    if (hasBlobToken) {
      const { list: blobList } = await import("@vercel/blob");
      const { blobs } = await blobList({ prefix: `${collection}/` });
      return Promise.all(
        blobs
          .filter((b) => b.pathname.endsWith(".json"))
          .map(async (b) => {
            const res = await fetch(b.url, { cache: "no-store" });
            return (await res.json()) as T;
          }),
      );
    }
    try {
      const files = await readdir(localDir);
      return await Promise.all(
        files
          .filter((f) => f.endsWith(".json"))
          .map(async (f) => {
            const content = await readFile(path.join(localDir, f), "utf-8");
            return JSON.parse(content) as T;
          }),
      );
    } catch {
      return [];
    }
  }

  async function get(id: string): Promise<T | null> {
    const records = await list();
    return records.find((r) => r.id === id) ?? null;
  }

  return { save, list, get };
}
