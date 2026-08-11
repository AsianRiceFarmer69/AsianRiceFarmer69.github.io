import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "playwright";
import { createServer } from "vite";

const repositoryRoot = resolve(import.meta.dirname, "..");
const outputDirectory = resolve(repositoryRoot, "visual-checks");
const address = "http://127.0.0.1:4173";
const videoIds = ["Xc6p7WxNs8Q", "EIzCjA4LbQU", "fGbMmU9d6NM", "nGm_EFrSYK8"];

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
  assert.ok(desktopLayout.height <= 1750, `Desktop page is too long at ${desktopLayout.height}px`);
  assert.match(await desktop.locator("h1").innerText(), /Andrew Le/);
  assert.match(await desktop.locator(".hero-bio").innerText(), /I've started since 2023/);
  assert.equal(await desktop.locator(".hero-wave path").count(), 12, "Purple wave treatment is missing");
  assert.equal(await desktop.locator(".expertise-grid article").count(), 3, "Expected three compact expertise items");
  assert.equal(await desktop.locator(".project-card").count(), 4, "Expected four clips in one project grid");
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
  for (const selector of [".expertise-grid", ".project-grid"]) {
    await mobile.locator(selector).scrollIntoViewIfNeeded();
    await mobile.waitForTimeout(450);
  }
  const mobileLayout = await layout(mobile);
  assert.equal(mobileLayout.scrollWidth, mobileLayout.clientWidth, "Mobile has horizontal overflow");
  assert.ok(mobileLayout.height <= 2350, `Mobile page is too long at ${mobileLayout.height}px`);
  assert.equal(
    (await mobile.locator(".project-grid").evaluate((element) => getComputedStyle(element).gridTemplateColumns)).split(" ").length,
    1,
    "Mobile project grid should use one column",
  );
  await mobile.screenshot({ path: resolve(outputDirectory, "mobile-compact.png"), fullPage: true });

  const reduced = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
  collectErrors(reduced, errors, "reduced-motion");
  await reduced.goto(address, { waitUntil: "domcontentloaded" });
  const reducedTrigger = reduced.locator("[data-video-trigger]").last();
  await reducedTrigger.click();
  assert.match(await reduced.locator(".dialog-video iframe").getAttribute("src"), /nGm_EFrSYK8/);

  assert.deepEqual(errors, [], `First-party console errors: ${errors.join(" | ")}`);
  await browser.close();

  console.log(JSON.stringify({
    desktop: { layout: desktopLayout, compact: true, expertiseItems: 3, projectClips: 4 },
    mobile: { layout: mobileLayout, singleColumnProjects: true },
    dialog: { keyboardAndEscape: true, selectedClipLoads: true, focusReturns: true },
    consoleErrors: errors,
  }, null, 2));
} finally {
  await server.close();
}
