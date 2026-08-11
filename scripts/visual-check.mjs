import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "playwright";
import { createServer } from "vite";

const repositoryRoot = resolve(import.meta.dirname, "..");
const outputDirectory = resolve(repositoryRoot, "visual-checks");
const address = "http://127.0.0.1:4173";

await mkdir(outputDirectory, { recursive: true });

const server = await createServer({
  configFile: resolve(repositoryRoot, "vite.config.js"),
  server: { host: "127.0.0.1", port: 4173, strictPort: true },
});

async function revealEntirePage(page) {
  await page.evaluate(async () => {
    const step = Math.max(420, Math.floor(window.innerHeight * 0.72));
    for (let position = 0; position < document.body.scrollHeight; position += step) {
      window.scrollTo(0, position);
      await new Promise((resolveDelay) => setTimeout(resolveDelay, 90));
    }
    window.scrollTo(0, document.body.scrollHeight);
  });
  await page.waitForTimeout(850);
}

try {
  await server.listen();
  const browser = await chromium.launch({
    channel: "chrome",
    headless: true,
    args: ["--enable-webgl", "--use-angle=swiftshader"],
  });

  const consoleErrors = [];
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));

  await page.goto(address, { waitUntil: "networkidle" });
  await page.locator("canvas").waitFor({ state: "visible" });
  await page.waitForTimeout(1200);

  const desktopEvidence = {
    title: await page.title(),
    heading: await page.locator("h1").innerText(),
    canvasCount: await page.locator("canvas").count(),
    videoPosterCount: await page.locator(".video-poster").count(),
    horizontalOverflow: await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    ),
  };

  await revealEntirePage(page);
  await page.screenshot({
    path: resolve(outputDirectory, "desktop-full.png"),
    fullPage: true,
  });
  await page.locator(".project-section").screenshot({
    path: resolve(outputDirectory, "desktop-project.png"),
  });
  await page.locator(".hero").screenshot({
    path: resolve(outputDirectory, "desktop-hero.png"),
  });
  await page.locator(".video-poster").click();
  await page.locator("iframe[title*='Combat Encounter']").waitFor({ state: "visible" });
  desktopEvidence.videoEmbedActivates = true;

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(address, { waitUntil: "networkidle" });
  await page.locator("canvas").waitFor({ state: "visible" });
  await page.waitForTimeout(900);
  await revealEntirePage(page);
  await page.screenshot({
    path: resolve(outputDirectory, "mobile-full.png"),
    fullPage: true,
  });
  await page.locator(".hero").screenshot({
    path: resolve(outputDirectory, "mobile-hero.png"),
  });

  const mobileEvidence = {
    horizontalOverflow: await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    ),
    menuVisible: await page.locator(".menu-button").isVisible(),
  };
  await page.locator(".menu-button").click();
  mobileEvidence.menuOpens = await page.locator(".mobile-nav").isVisible();
  await page.keyboard.press("Escape");
  await page.locator(".mobile-nav").waitFor({ state: "detached" });
  mobileEvidence.escapeClosesMenu = true;

  await browser.close();
  console.log(JSON.stringify({ desktopEvidence, mobileEvidence, consoleErrors }, null, 2));
} finally {
  await server.close();
}
