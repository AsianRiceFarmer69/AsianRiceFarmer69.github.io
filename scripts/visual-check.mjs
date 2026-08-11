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

try {
  await server.listen();
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const consoleErrors = [];

  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  installErrorCollection(page, consoleErrors, "desktop");
  await page.goto(address, { waitUntil: "domcontentloaded" });
  await page.locator(".hero-showcase").waitFor({ state: "visible" });
  await page.waitForTimeout(900);

  const desktopLayout = await layout(page);
  assert.equal(desktopLayout.scrollWidth, desktopLayout.clientWidth, "Desktop has horizontal overflow");
  assert.ok(desktopLayout.height >= 3000, "Expected the complete portfolio sections");
  assert.match(await page.locator("h1").innerText(), /Roblox animation[.]\s*Made to hit[.]/);
  assert.equal(
    await page.locator(".site-header").evaluate((element) => getComputedStyle(element).position),
    "sticky",
  );
  assert.equal(await page.locator("canvas").count(), 0, "Heavy canvas effect was added unexpectedly");
  assert.equal(await page.locator('[class*="vui-"]').count(), 0, "VengeanceUI remnants are still rendered");

  const preview = page.locator(".video-preview");
  assert.equal(await preview.count(), 1, "Moving YouTube preview is missing");
  const previewSource = await preview.getAttribute("src");
  assert.match(previewSource, /autoplay=1/);
  assert.match(previewSource, /mute=1/);
  assert.match(previewSource, /loop=1/);
  assert.equal(await page.locator(".watch-button").count(), 1, "Simple watch button is missing");
  await page.screenshot({ path: resolve(outputDirectory, "desktop-roborock-hero.png") });

  await reveal(page, ".capability-grid");
  assert.equal(await page.locator(".capability-card").count(), 3);
  const firstCard = page.locator(".capability-card").first();
  const cardBox = await firstCard.boundingBox();
  assert.ok(cardBox, "Capability card is missing");
  const spotlightLayer = firstCard.locator('[data-testid="card-spotlight-layer"]');
  const spotlightBefore = await spotlightLayer.evaluate((element) => getComputedStyle(element).backgroundImage);
  await page.mouse.move(cardBox.x + cardBox.width * 0.8, cardBox.y + cardBox.height * 0.25);
  await page.waitForTimeout(180);
  const spotlightAfter = await spotlightLayer.evaluate((element) => getComputedStyle(element).backgroundImage);
  assert.notEqual(spotlightBefore, spotlightAfter, "Aceternity Card Spotlight does not follow the pointer");
  assert.match(spotlightAfter, /radial-gradient/);
  await page.screenshot({ path: resolve(outputDirectory, "desktop-aceternity-spotlight.png") });

  await reveal(page, ".process-section");
  assert.equal(await page.locator(".process-steps article").count(), 3);
  assert.match(await page.locator(".process-intro").innerText(), /From your idea to motion/);
  const processBackground = await page.locator(".process-section").evaluate(
    (element) => getComputedStyle(element).backgroundColor,
  );
  assert.equal(processBackground, "rgb(5, 5, 6)", "Agency-style process panel should be dark");
  await page.screenshot({ path: resolve(outputDirectory, "desktop-agency-process.png") });

  await reveal(page, ".brief-section");
  const gooey = page.locator(".official-gooey-input");
  const gooeyFilterWrap = gooey.locator(":scope > div");
  const gooeyRow = gooeyFilterWrap.locator(":scope > div").first();
  const collapsedWidth = (await gooeyRow.boundingBox()).width;
  assert.ok(Math.abs(collapsedWidth - 115) <= 1, `Official collapsed width was ${collapsedWidth}px`);
  const gooeyButton = gooey.getByRole("button");
  await gooeyButton.click();
  await page.waitForTimeout(520);
  const searchInput = gooey.getByRole("searchbox");
  assert.equal(await searchInput.isEnabled(), true);
  assert.equal(await searchInput.evaluate((element) => document.activeElement === element), true);
  const expandedWidth = (await gooeyRow.boundingBox()).width;
  assert.ok(Math.abs(expandedWidth - 200) <= 1, `Official expanded width was ${expandedWidth}px`);
  const expandedMargin = Number.parseFloat(await gooeyRow.evaluate((element) => getComputedStyle(element).marginLeft));
  assert.ok(Math.abs(expandedMargin - 50) <= 1, `Official expanded offset was ${expandedMargin}px`);
  const filterStyle = await gooeyFilterWrap.evaluate(
    (element) => getComputedStyle(element).filter,
  );
  assert.match(filterStyle, /url/);
  assert.equal(await gooey.locator("feGaussianBlur").count(), 1, "Gooey SVG blur filter is missing");
  assert.equal(await gooey.getByRole("button", { name: /send/i }).count(), 0, "Custom Send button still exists");
  await searchInput.fill("Combat");
  await page.screenshot({ path: resolve(outputDirectory, "desktop-official-aceternity-gooey.png") });

  await page.locator("#top").scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const videoTrigger = page.locator("[data-video-trigger]");
  await videoTrigger.focus();
  await page.keyboard.press("Enter");
  await page.locator(".dialog-video iframe").waitFor({ state: "visible" });
  assert.equal(await page.getByRole("dialog").count(), 1, "Video dialog did not open");
  await page.keyboard.press("Escape");
  await page.getByRole("dialog").waitFor({ state: "detached" });
  assert.equal(await videoTrigger.evaluate((element) => document.activeElement === element), true);

  for (const selector of [".capability-grid", ".process-steps", ".about-section", ".brief-section"]) {
    await reveal(page, selector);
  }
  await page.screenshot({ path: resolve(outputDirectory, "desktop-full.png"), fullPage: true });

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  installErrorCollection(mobile, consoleErrors, "mobile");
  await mobile.goto(address, { waitUntil: "domcontentloaded" });
  await mobile.locator(".hero-showcase").waitFor({ state: "visible" });
  const mobileLayout = await layout(mobile);
  assert.equal(mobileLayout.scrollWidth, mobileLayout.clientWidth, "Mobile has horizontal overflow");
  assert.equal(
    await mobile.locator(".site-nav").evaluate((element) => getComputedStyle(element).display),
    "none",
  );
  await reveal(mobile, ".brief-section");
  await mobile.locator(".official-gooey-input").getByRole("button").click();
  await mobile.waitForTimeout(520);
  const expandedMobileLayout = await layout(mobile);
  assert.equal(expandedMobileLayout.scrollWidth, expandedMobileLayout.clientWidth, "Expanded mobile Gooey Input overflows");
  await mobile.screenshot({ path: resolve(outputDirectory, "mobile-gooey.png"), fullPage: true });

  const reduced = await browser.newPage({
    viewport: { width: 1280, height: 900 },
    reducedMotion: "reduce",
  });
  installErrorCollection(reduced, consoleErrors, "reduced-motion");
  await reduced.goto(address, { waitUntil: "domcontentloaded" });
  await reduced.locator(".hero-showcase").waitFor({ state: "visible" });
  assert.equal(await reduced.locator(".video-preview").count(), 0, "Reduced motion should stop autoplay preview");
  assert.equal(await reduced.locator(".video-fallback").count(), 1);
  await reveal(reduced, ".brief-section");
  const reducedGooey = reduced.locator(".official-gooey-input");
  await reducedGooey.getByRole("button").click();
  assert.equal(await reducedGooey.getByRole("searchbox").isEnabled(), true);

  assert.deepEqual(consoleErrors, [], `First-party console errors: ${consoleErrors.join(" | ")}`);
  await browser.close();

  console.log(JSON.stringify({
    desktop: {
      layout: desktopLayout,
      roborockProductHero: true,
      movingYouTubePreview: true,
      simpleWatchButton: true,
      aceternityCardSpotlight: true,
      agencyGridHorizon: true,
      officialAceternityGooeyInput: true,
      videoDialogKeyboardAndEscape: true,
    },
    mobile: {
      layout: mobileLayout,
      noOverflowAfterGooeyExpansion: true,
    },
    reducedMotion: {
      autoplayStopped: true,
      interactionsStillWork: true,
    },
    consoleErrors,
  }, null, 2));
} finally {
  await server.close();
}
