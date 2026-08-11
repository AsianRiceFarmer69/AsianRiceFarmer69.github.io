import { cp, copyFile, mkdir, rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, "..");
const buildDirectory = resolve(repositoryRoot, "dist");

await rm(resolve(repositoryRoot, "assets"), { recursive: true, force: true });
await mkdir(resolve(repositoryRoot, "assets"), { recursive: true });
await copyFile(
  resolve(buildDirectory, "index.html"),
  resolve(repositoryRoot, "index.html"),
);
await copyFile(
  resolve(buildDirectory, "favicon.svg"),
  resolve(repositoryRoot, "favicon.svg"),
);
await cp(resolve(buildDirectory, "assets"), resolve(repositoryRoot, "assets"), {
  recursive: true,
});

console.log("GitHub Pages files copied to the repository root.");

