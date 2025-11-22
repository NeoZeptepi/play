#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const versionPath = path.resolve(__dirname, "../version.json");

const now = new Date();
const yy = String(now.getFullYear()).slice(-2);
const mm = String(now.getMonth() + 1).padStart(2, "0");
const dd = String(now.getDate()).padStart(2, "0");
const prefix = `${yy}.${mm}.${dd}`;

let previous = null;
try {
  const raw = await readFile(versionPath, "utf8");
  previous = JSON.parse(raw).version ?? null;
} catch (err) {
  if (err.code !== "ENOENT") {
    console.error("[version] Unable to read existing version file", err);
    process.exit(1);
  }
}

let increment = 0;
if (previous && previous.startsWith(prefix)) {
  const parts = previous.split(".");
  const last = parts[3] ?? "0";
  increment = Number.parseInt(last, 10);
  if (Number.isNaN(increment)) {
    increment = 0;
  }
  increment += 1;
}

const version = `${prefix}.${String(increment).padStart(2, "0")}`;

await writeFile(versionPath, JSON.stringify({ version }, null, 2) + "\n");

console.log(`Version updated to ${version}`);
