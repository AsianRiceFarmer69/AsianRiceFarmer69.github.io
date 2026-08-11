import assert from "node:assert/strict";
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

function installErrorCollection(page, errors, prefix) {
  page.on("console", (message) => {
    const source = message.location().url || "";
    if (
      message.type() === "error" &&
      (source.startsWith(address) || source === "") &&
      !message.text().includes("favicon")
    ) {
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

async function reveal(page, selector) {
  await page.locator(selector).scrollIntoViewIfNeeded();
  await page.waitForTimeout(650);
}

async function leftPosition(locator) {
  return Number.parseFloat(await locator.evaluate((element) => getComputedStyle(element).left));
}

try {
  await server.listen();
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const consoleErrors = [];

  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  installErrorCollection(page, consoleErrors, "desktop");
  await page.goto(address, { waitUntil: "domcontentloaded" });
  await page.locator(".project-media-primary").waitFor({ state: "visible" });
  await page.waitForTimeout(700);

  const desktopLayout = await layout(page);
  assert.equal(desktopLayout.scrollWidth, desktopLayout.clientWidth, "Desktop has horizontal overflow");
  assert.ok(desktopLayout.height >= 2500, "The complete editorial portfolio is unexpectedly short");
  assert.match(await page.locator("h1").innerText(), /Hello, I'm Andrew[.]\s*I animate for Roblox[.]/);
  assert.match(await page.locator(".intro-copy").innerText(), /I've started since 2023/);
  assert.equal(await page.locator(".intro-copy p").count(), 3, "Intro should stay direct and three paragraphs long");
  assert.equal(
    await page.locator(".site-header").evaluate((element) => getComputedStyle(element).position),
    "sticky",
  );
  assert.equal(await page.locator("canvas").count(), 0, "A heavy canvas effect was added unexpectedly");
  assert.equal(await page.locator(".official-gooey-input").count(), 0, "The Gooey Input demo still renders");
  assert.equal(await page.locator(".capability-card").count(), 0, "The old component cards still render");
  await page.screenshot({ path: resolve(outputDirectory, "desktop-intro.png") });

  await reveal(page, ".project-gallery");
  const preview = page.locator(".video-preview");
  assert.equal(await preview.count(), 4, "All four moving project previews should render");
  const previewSources = await preview.evaluateAll((frames) => frames.map((frame) => frame.getAttribute("src")));
  for (const videoId of ["Xc6p7WxNs8Q", "EIzCjA4LbQU", "fGbMmU9d6NM", "nGm_EFrSYK8"]) {
    assert.ok(previewSources.some((source) => source.includes(videoId)), `Missing project clip ${videoId}`);
  }
  assert.ok(previewSources.every((source) => /autoplay=1/.test(source)));
  assert.ok(previewSources.every((source) => /mute=1/.test(source)));
  assert.ok(previewSources.every((source) => /loop=1/.test(source)));
  assert.equal(await page.locator(".watch-button").count(), 4, "Each project clip needs a watch button");

  const playhead = page.locator('[data-motion="playhead"]');
  const playheadStart = await leftPosition(playhead);
  await page.waitForTimeout(550);
  const playheadEnd = await leftPosition(playhead);
  assert.ok(Math.abs(playheadEnd - playheadStart) >= 20, "The project playhead is not visibly moving");
  await page.screenshot({ path: resolve(outputDirectory, "desktop-selected-work.png") });

  assert.equal(await page.locator(".focus-list article").count(), 3, "Expected three honest focus areas");
  await reveal(page, ".focus-list");
  await page.screenshot({ path: resolve(outputDirectory, "desktop-focus.png") });

  await reveal(page, ".about-section");
  assert.match(await page.locator(".about-section h2").innerText(), /Moon Animator is my foundation/);
  await page.screenshot({ path: resolve(outputDirectory, "desktop-about.png") });

  await page.locator("#work").scrollIntoViewIfNeeded();
  const videoTrigger = page.locator("[data-video-trigger]").nth(1);
  await videoTrigger.focus();
  await page.keyboard.press("Enter");
  await page.locator(".dialog-video iframe").waitFor({ state: "visible" });
  assert.equal(await page.getByRole("dialog").count(), 1, "Video dialog did not open");
  assert.match(await page.locator(".dialog-video iframe").getAttribute("src"), /EIzCjA4LbQU/);
  await page.keyboard.press("Escape");
  await page.getByRole("dialog").waitFor({ state: "detached" });
  await page.waitForTimeout(120);
  assert.equal(await videoTrigger.evaluate((element) => document.activeElement === element), true);

  await page.screenshot({ path: resolve(outputDirectory, "desktop-full.png"), fullPage: true });

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  installErrorCollection(mobile, consoleErrors, "mobile");
  await mobile.goto(address, { waitUntil: "domcontentloaded" });
  await mobile.locator(".project-media-primary").waitFor({ state: "visible" });
  const mobileLayout = await layout(mobile);
  assert.equal(mobileLayout.scrollWidth, mobileLayout.clientWidth, "Mobile has horizontal overflow");
  assert.equal(
    await mobile.locator(".site-header .brand-name").evaluate((element) => getComputedStyle(element).display),
    "none",
  );
  assert.equal(
    (await mobile.locator(".project-layout").evaluate((element) => getComputedStyle(element).gridTemplateColumns)).split(" ").length,
    1,
    "Mobile project should use one column",
  );
  for (const selector of [".project-gallery", ".project-copy", ".focus-list", ".about-inner"]) {
    await reveal(mobile, selector);
  }
  await mobile.screenshot({ path: resolve(outputDirectory, "mobile-full.png"), fullPage: true });

  const reduced = await browser.newPage({
    viewport: { width: 1280, height: 900 },
    reducedMotion: "reduce",
  });
  installErrorCollection(reduced, consoleErrors, "reduced-motion");
  await reduced.goto(address, { waitUntil: "domcontentloaded" });
  await reduced.locator(".project-media-primary").waitFor({ state: "visible" });
  assert.equal(await reduced.locator(".video-preview").count(), 0, "Reduced motion should stop autoplay preview");
  assert.equal(await reduced.locator(".video-fallback").count(), 4);
  const reducedPlayhead = reduced.locator('[data-motion="playhead"]');
  const reducedStart = await leftPosition(reducedPlayhead);
  await reduced.waitForTimeout(350);
  const reducedEnd = await leftPosition(reducedPlayhead);
  assert.ok(Math.abs(reducedEnd - reducedStart) <= 1, "Reduced motion should stop the playhead");
  const reducedTrigger = reduced.locator("[data-video-trigger]").first();
  await reducedTrigger.click();
  assert.equal(await reduced.getByRole("dialog").count(), 1, "Video dialog should still work with reduced motion");

  assert.deepEqual(consoleErrors, [], `First-party console errors: ${consoleErrors.join(" | ")}`);
  await browser.close();

  console.log(JSON.stringify({
    desktop: {
      layout: desktopLayout,
      directIntro: true,
      singleRealProject: true,
      movingYouTubePreview: true,
      movingPlayhead: true,
      videoDialogKeyboardAndEscape: true,
    },
    mobile: {
      layout: mobileLayout,
      singleColumnWork: true,
    },
    reducedMotion: {
      autoplayStopped: true,
      playheadStopped: true,
      dialogStillWorks: true,
    },
    consoleErrors,
  }, null, 2));
} finally {
  await server.close();
}
