import { mkdir, readFile, readdir, writeFile } from "fs/promises";
import path from "path";
import type { OnboardingRecord } from "./types";

// Durable storage in production (set BLOB_READ_WRITE_TOKEN by attaching a Vercel
// Blob store to the project). Without it, we fall back to local disk so
// `npm run dev` works out of the box — that path is NOT durable on Vercel's
// read-only serverless filesystem and is for local testing only.
const hasBlobToken = !!process.env.BLOB_READ_WRITE_TOKEN;

const LOCAL_DATA_DIR = path.join(process.cwd(), ".data", "clients");
const LOCAL_UPLOADS_DIR = path.join(process.cwd(), "public", "uploads", "clients");

export async function saveUploadedFile(
  clientId: string,
  field: string,
  file: File,
): Promise<string | null> {
  if (!file || file.size === 0) return null;
  const buffer = Buffer.from(await file.arrayBuffer());
  const blobPath = `clients/${clientId}/${field}/${file.name}`;

  if (hasBlobToken) {
    const { put } = await import("@vercel/blob");
    const blob = await put(blobPath, buffer, {
      access: "public",
      contentType: file.type || undefined,
      addRandomSuffix: true,
    });
    return blob.url;
  }

  const dir = path.join(LOCAL_UPLOADS_DIR, clientId, field);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, file.name), buffer);
  return `/uploads/clients/${clientId}/${field}/${encodeURIComponent(file.name)}`;
}

export async function saveOnboardingRecord(record: OnboardingRecord): Promise<void> {
  const json = JSON.stringify(record, null, 2);

  if (hasBlobToken) {
    const { put } = await import("@vercel/blob");
    await put(`clients/${record.id}/record.json`, json, {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return;
  }

  await mkdir(LOCAL_DATA_DIR, { recursive: true });
  await writeFile(path.join(LOCAL_DATA_DIR, `${record.id}.json`), json);
}

// Used by the internal ops dashboard (phase 2) to list submitted clients.
export async function listOnboardingRecords(): Promise<OnboardingRecord[]> {
  if (hasBlobToken) {
    const { list } = await import("@vercel/blob");
    const { blobs } = await list({ prefix: "clients/" });
    const recordBlobs = blobs.filter((b) => b.pathname.endsWith("/record.json"));
    const records = await Promise.all(
      recordBlobs.map(async (b) => {
        const res = await fetch(b.url, { cache: "no-store" });
        return (await res.json()) as OnboardingRecord;
      }),
    );
    return records.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
  }

  try {
    const files = await readdir(LOCAL_DATA_DIR);
    const records = await Promise.all(
      files
        .filter((f) => f.endsWith(".json"))
        .map(async (f) => {
          const content = await readFile(path.join(LOCAL_DATA_DIR, f), "utf-8");
          return JSON.parse(content) as OnboardingRecord;
        }),
    );
    return records.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
  } catch {
    return [];
  }
}
