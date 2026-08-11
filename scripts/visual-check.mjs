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

async function collectLayout(page) {
  return page.evaluate(() => ({
    height: document.documentElement.scrollHeight,
    viewportHeight: window.innerHeight,
    horizontalOverflow:
      document.documentElement.scrollWidth > document.documentElement.clientWidth,
  }));
}

try {
  await server.listen();
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const consoleErrors = [];

  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));

  await page.goto(address, { waitUntil: "domcontentloaded" });
  await page.locator(".project-card").waitFor({ state: "visible" });
  await page.waitForTimeout(900);

  const desktopEvidence = {
    title: await page.title(),
    heading: await page.locator("h1").innerText(),
    canvasCount: await page.locator("canvas").count(),
    projectPosterCount: await page.locator(".project-poster").count(),
    tabCount: await page.locator('[role="tab"]').count(),
    layout: await collectLayout(page),
  };

  await page.screenshot({
    path: resolve(outputDirectory, "desktop-full.png"),
    fullPage: true,
  });
  await page.locator(".intro-project").screenshot({
    path: resolve(outputDirectory, "desktop-top.png"),
  });
  await page.locator(".overview").screenshot({
    path: resolve(outputDirectory, "desktop-overview.png"),
  });

  await page.locator(".vui-highlight-cell").nth(2).click();
  desktopEvidence.highlightGridChanges = (
    await page.locator(".vui-highlight-detail").innerText()
  ).includes("brief");

  await page.getByRole("tab", { name: "Workflow" }).click();
  desktopEvidence.workflowPanel = (
    await page.getByRole("tabpanel").innerText()
  ).includes("Blender");
  await page.waitForTimeout(360);
  await page.locator(".overview").screenshot({
    path: resolve(outputDirectory, "desktop-workflow.png"),
  });
  await page.getByRole("tab", { name: "Workflow" }).focus();
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(120);
  desktopEvidence.keyboardTabs =
    (await page.getByRole("tab", { name: "About" }).getAttribute("data-state")) ===
    "active";

  await page.locator(".showcase-button").click();
  await page.locator("iframe[title*='Combat Encounter']").waitFor({ state: "visible" });
  desktopEvidence.videoDialogOpens = true;
  await page.waitForTimeout(650);
  await page.screenshot({
    path: resolve(outputDirectory, "desktop-video-dialog.png"),
  });
  await page.keyboard.press("Escape");
  await page.locator("iframe[title*='Combat Encounter']").waitFor({ state: "detached" });
  desktopEvidence.escapeClosesDialog = true;

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  mobile.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(`mobile: ${message.text()}`);
  });
  mobile.on("pageerror", (error) => consoleErrors.push(`mobile: ${error.message}`));
  await mobile.goto(address, { waitUntil: "domcontentloaded" });
  await mobile.locator(".project-card").waitFor({ state: "visible" });
  await mobile.waitForTimeout(800);
  await mobile.screenshot({
    path: resolve(outputDirectory, "mobile-full.png"),
    fullPage: true,
  });

  const mobileEvidence = {
    layout: await collectLayout(mobile),
    navigationButtonCount: await mobile.locator(".menu-button").count(),
    showcaseButtonVisible: await mobile.locator(".showcase-button").isVisible(),
  };
  await mobile.getByRole("tab", { name: "About" }).click();
  mobileEvidence.aboutPanelVisible = (
    await mobile.getByRole("tabpanel").innerText()
  ).includes("understanding");

  const reducedMotionPage = await browser.newPage({
    viewport: { width: 1280, height: 800 },
    reducedMotion: "reduce",
  });
  await reducedMotionPage.goto(address, { waitUntil: "domcontentloaded" });
  await reducedMotionPage.locator("h1").waitFor({ state: "visible" });
  const reducedMotionEvidence = {
    headingVisible: await reducedMotionPage.locator("h1").isVisible(),
  };

  await browser.close();
  console.log(
    JSON.stringify(
      { desktopEvidence, mobileEvidence, reducedMotionEvidence, consoleErrors },
      null,
      2,
    ),
  );
} finally {
  await server.close();
}
