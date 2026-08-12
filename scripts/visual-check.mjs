import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "playwright";
import { createServer } from "vite";

const repositoryRoot = resolve(import.meta.dirname, "..");
const outputDirectory = resolve(repositoryRoot, "visual-checks");
const address = "http://127.0.0.1:4173";
const videoIds = [
  "Xc6p7WxNs8Q", "EIzCjA4LbQU", "fGbMmU9d6NM", "nGm_EFrSYK8",
  "TB0oHccSFOY", "nc6DqCFRbn4", "iKawZ5HKZ7E", "3dsFml4PJFc",
];

await mkdir(outputDirectory, { recursive: true });

const server = await createServer({
  configFile: resolve(repositoryRoot, "vite.config.js"),
  server: { host: "127.0.0.1", port: 4173, strictPort: true },
});

function collectErrors(page, errors, prefix) {
  page.on("console", (message) => {
    const source = message.location().url || "";
    if (message.type() === "error" && (source.startsWith(address) || source === "")) {
      errors.push(`${prefix}: ${message.text()}`);
    }
  });
  page.on("pageerror", (error) => errors.push(`${prefix}: ${error.message}`));
}

async function layout(page) {
  return page.evaluate(() => ({
    height: document.documentElement.scrollHeight,
    viewportHeight: innerHeight,
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
}

try {
  await server.listen();
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const errors = [];

  const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  collectErrors(desktop, errors, "desktop");
  await desktop.goto(address, { waitUntil: "domcontentloaded" });
  await desktop.locator(".project-card").first().waitFor({ state: "visible" });
  await desktop.waitForTimeout(500);

  const desktopLayout = await layout(desktop);
  assert.equal(desktopLayout.scrollWidth, desktopLayout.clientWidth, "Desktop has horizontal overflow");
  assert.ok(desktopLayout.height <= 2500, `Desktop page is too long at ${desktopLayout.height}px`);
  assert.equal(await desktop.locator(".hero").count(), 0, "The removed profile hero still renders");
  assert.equal(await desktop.locator("footer").count(), 0, "The removed footer still renders");
  assert.equal(await desktop.locator(".ambient-wave").count(), 0, "The removed squiggly line still renders");
  assert.match(await desktop.locator(".brand").innerText(), /ARF_0503/);
  assert.match(await desktop.locator(".brand").innerText(), /Roblox Animator \/ Since 2023/i);
  assert.equal(await desktop.locator(".site-header nav").count(), 0, "The removed header navigation still renders");
  assert.equal(await desktop.locator(".expertise-grid").count(), 0, "The removed expertise claims still render");
  assert.equal(await desktop.getByText("Combat animation", { exact: true }).count(), 0);
  assert.equal(await desktop.getByText("Cinematic sequences", { exact: true }).count(), 0);
  assert.equal(await desktop.locator(".workflow-grid article").count(), 3, "Expected three truthful workflow items");
  assert.equal(await desktop.locator(".workflow-grid svg").count(), 3, "Workflow icons are missing");
  assert.match(await desktop.locator(".workflow-grid").innerText(), /previous animation workflow/i);
  assert.match(await desktop.locator(".workflow-grid").innerText(), /current animation workflow/i);
  assert.match(await desktop.locator(".workflow-grid").innerText(), /VFX.*sound events.*test.*in game/is);
  assert.equal(await desktop.locator(".work-section").count(), 2, "Expected two project sections");
  assert.equal(await desktop.locator(".project-card").count(), 8, "Expected eight clips across two projects");
  assert.equal(await desktop.locator(".project-stills img").count(), 2, "Expected two FPS development screenshots");
  assert.match(await desktop.locator("#fps-project").innerText(), /FPS Project/);
  assert.equal(await desktop.getByText(/with sound/i).count(), 0, "The removed sound claim still renders");
  assert.equal(await desktop.locator(".dialog-video iframe").count(), 0, "Video iframe should load only after a clip is opened");
  for (const id of videoIds) {
    assert.equal(await desktop.locator(`[data-video-id="${id}"]`).count(), 1, `Missing project clip ${id}`);
  }
  await desktop.screenshot({ path: resolve(outputDirectory, "desktop-compact.png"), fullPage: true });

  const secondTrigger = desktop.locator("[data-video-trigger]").nth(1);
  await secondTrigger.focus();
  await desktop.keyboard.press("Enter");
  const dialogFrame = desktop.locator(".dialog-video iframe");
  await dialogFrame.waitFor({ state: "visible" });
  assert.match(await dialogFrame.getAttribute("src"), /EIzCjA4LbQU/);
  await desktop.keyboard.press("Escape");
  await desktop.getByRole("dialog").waitFor({ state: "detached" });
  await desktop.waitForTimeout(100);
  assert.equal(await secondTrigger.evaluate((element) => document.activeElement === element), true);

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  collectErrors(mobile, errors, "mobile");
  await mobile.goto(address, { waitUntil: "domcontentloaded" });
  await mobile.locator(".project-card").first().waitFor({ state: "visible" });
  for (const locator of [mobile.locator(".workflow-grid"), mobile.locator(".project-grid").last()]) {
    await locator.scrollIntoViewIfNeeded();
    await mobile.waitForTimeout(450);
  }
  const mobileLayout = await layout(mobile);
  assert.equal(mobileLayout.scrollWidth, mobileLayout.clientWidth, "Mobile has horizontal overflow");
  assert.ok(mobileLayout.height <= 3800, `Mobile page is too long at ${mobileLayout.height}px`);
  assert.equal(
    (await mobile.locator(".project-grid").last().evaluate((element) => getComputedStyle(element).gridTemplateColumns)).split(" ").length,
    1,
    "Mobile project grid should use one column",
  );
  await mobile.screenshot({ path: resolve(outputDirectory, "mobile-compact.png"), fullPage: true });

  const reduced = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
  collectErrors(reduced, errors, "reduced-motion");
  await reduced.goto(address, { waitUntil: "domcontentloaded" });
  const reducedTrigger = reduced.locator("[data-video-trigger]").last();
  await reducedTrigger.click();
  assert.match(await reduced.locator(".dialog-video iframe").getAttribute("src"), /3dsFml4PJFc/);

  assert.deepEqual(errors, [], `First-party console errors: ${errors.join(" | ")}`);
  await browser.close();

  console.log(JSON.stringify({
    desktop: { layout: desktopLayout, truthfulWorkflowWithIcons: true, projects: 2, projectClips: 8, fpsStills: 2 },
    mobile: { layout: mobileLayout, singleColumnProjects: true },
    dialog: { keyboardAndEscape: true, selectedClipLoads: true, focusReturns: true },
    consoleErrors: errors,
  }, null, 2));
} finally {
  await server.close();
}
