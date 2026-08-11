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

async function layout(page) {
  return page.evaluate(() => ({
    height: document.documentElement.scrollHeight,
    viewportHeight: window.innerHeight,
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
}

async function axisRange(locator, axis, count = 14, delay = 120) {
  const samples = [];
  for (let index = 0; index < count; index += 1) {
    const box = await locator.boundingBox();
    assert.ok(box, `Missing bounding box for ${axis} motion`);
    samples.push(box[axis]);
    await locator.page().waitForTimeout(delay);
  }
  return Number((Math.max(...samples) - Math.min(...samples)).toFixed(2));
}

async function matrixMetrics(locator) {
  return locator.evaluate((element) => {
    const matrix = new DOMMatrixReadOnly(getComputedStyle(element).transform);
    return { m13: matrix.m13, m23: matrix.m23, x: matrix.m41, y: matrix.m42 };
  });
}

function installErrorCollection(page, errors, prefix = "desktop") {
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

try {
  await server.listen();
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const consoleErrors = [];

  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  installErrorCollection(page, consoleErrors);
  await page.goto(address, { waitUntil: "domcontentloaded" });
  await page.locator('[data-interactive="project-card"]').waitFor({ state: "visible" });
  await page.waitForTimeout(800);

  const desktopLayout = await layout(page);
  assert.equal(desktopLayout.scrollWidth, desktopLayout.clientWidth, "Desktop has horizontal overflow");
  assert.equal(await page.locator("canvas").count(), 0, "Unexpected canvas found");
  assert.equal(await page.getByRole("tab").count(), 3, "Expected three navigation tabs");

  const preview = page.locator(".video-preview");
  assert.equal(await preview.count(), 1, "Moving YouTube preview is missing");
  const previewSource = await preview.getAttribute("src");
  assert.match(previewSource, /autoplay=1/);
  assert.match(previewSource, /mute=1/);
  assert.match(previewSource, /loop=1/);

  const vengeanceButton = page.locator(".vui-animated-button");
  assert.equal(await vengeanceButton.count(), 1, "VengeanceUI Animated Button is missing");
  const maskSamples = [];
  const opacitySamples = [];
  for (let sample = 0; sample < 12; sample += 1) {
    maskSamples.push(
      await page.locator(".vui-animated-button-label").evaluate((element) => {
        const style = getComputedStyle(element);
        return style.maskImage || style.webkitMaskImage;
      }),
    );
    opacitySamples.push(
      Number(await page.locator(".vui-animated-button-border").evaluate((element) => getComputedStyle(element).opacity)),
    );
    await page.waitForTimeout(120);
  }
  assert.ok(new Set(maskSamples).size >= 3, "Animated Button text shine does not move");
  assert.ok(new Set(opacitySamples.map((value) => value.toFixed(2))).size >= 3, "Animated Button border shine does not animate");
  assert.ok(Math.max(...opacitySamples) >= 0.2, "Animated Button border shine is not visible");

  const frameCounter = page.locator(".vui-animated-number");
  const frameBefore = await frameCounter.getAttribute("data-value");
  await page.waitForFunction(
    (previous) => document.querySelector(".vui-animated-number")?.getAttribute("data-value") !== previous,
    frameBefore,
  );
  const frameAfter = await frameCounter.getAttribute("data-value");
  assert.notEqual(frameBefore, frameAfter, "VengeanceUI Animated Number does not change");
  await page.screenshot({ path: resolve(outputDirectory, "desktop-vengeance-components.png"), fullPage: true });

  const avatarTravel = await axisRange(page.locator('[data-motion="avatar"]'), "y");
  const playheadTravel = await axisRange(page.locator('[data-motion="playhead"]'), "x", 10, 100);
  assert.ok(avatarTravel >= 6, `Avatar travel was only ${avatarTravel}px`);
  assert.ok(playheadTravel >= 32, `Playhead travel was only ${playheadTravel}px`);

  const card = page.locator('[data-interactive="project-card"]');
  const cardBox = await card.boundingBox();
  assert.ok(cardBox, "Project card is missing");
  await page.mouse.move(cardBox.x + 35, cardBox.y + 35);
  await page.waitForTimeout(320);
  const upperLeftTilt = await matrixMetrics(card);
  const upperLeftAura = await matrixMetrics(page.locator('[data-testid="cursor-aura"]'));
  await page.screenshot({ path: resolve(outputDirectory, "desktop-pointer-left.png"), fullPage: true });

  await page.mouse.move(cardBox.x + cardBox.width - 35, cardBox.y + cardBox.height - 35);
  await page.waitForTimeout(320);
  const lowerRightTilt = await matrixMetrics(card);
  const lowerRightAura = await matrixMetrics(page.locator('[data-testid="cursor-aura"]'));
  assert.ok(
    Math.abs(upperLeftTilt.m13 - lowerRightTilt.m13) >= 0.08,
    "Project card does not visibly tilt across pointer positions",
  );
  assert.ok(
    Math.abs(upperLeftAura.x - lowerRightAura.x) >= 250,
    "Cursor-following light does not visibly travel",
  );

  await page.mouse.move(20, 20);
  await page.waitForTimeout(620);
  const neutralTilt = await matrixMetrics(card);
  assert.ok(Math.abs(neutralTilt.m13) <= 0.02, "Project card does not settle after pointer leave");

  await page.getByRole("button", { name: "Switch to light theme" }).click();
  assert.equal(await page.locator(".site-canvas").getAttribute("data-theme"), "light");
  await page.waitForTimeout(380);
  await page.screenshot({ path: resolve(outputDirectory, "desktop-light-theme.png"), fullPage: true });
  await page.getByRole("button", { name: "Switch to dark theme" }).click();

  await page.getByRole("tab", { name: "Work" }).focus();
  await page.keyboard.press("ArrowRight");
  await page.locator(".process-panel").waitFor({ state: "visible" });
  assert.match(await page.getByRole("tabpanel").innerText(), /My Process/);
  await page.getByRole("button", { name: /Polish/ }).click();
  await page.locator(".process-detail").filter({ hasText: "respond to notes" }).waitFor();
  assert.match(await page.locator(".process-detail").innerText(), /respond to notes/i);
  await page.screenshot({ path: resolve(outputDirectory, "desktop-process.png"), fullPage: true });

  await page.getByRole("tab", { name: "Work" }).click();
  const videoTrigger = page.locator("[data-video-trigger]");
  await videoTrigger.focus();
  await page.keyboard.press("Enter");
  await page.locator(".dialog-video iframe").waitFor({ state: "visible" });
  assert.equal(await page.getByRole("dialog").count(), 1, "Video dialog did not open");
  await page.screenshot({ path: resolve(outputDirectory, "desktop-video-dialog.png") });
  await page.keyboard.press("Escape");
  await page.getByRole("dialog").waitFor({ state: "detached" });
  assert.equal(await videoTrigger.evaluate((element) => document.activeElement === element), true);

  await page.screenshot({ path: resolve(outputDirectory, "desktop-full.png"), fullPage: true });

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  installErrorCollection(mobile, consoleErrors, "mobile");
  await mobile.goto(address, { waitUntil: "domcontentloaded" });
  await mobile.locator("[data-sidebar]").waitFor({ state: "visible" });
  await mobile.waitForTimeout(500);
  const mobileLayout = await layout(mobile);
  assert.equal(mobileLayout.scrollWidth, mobileLayout.clientWidth, "Mobile has horizontal overflow");
  assert.equal(await mobile.locator(".portfolio-nav").evaluate((element) => getComputedStyle(element).position), "fixed");

  const sidebar = mobile.locator("[data-sidebar]");
  const sidebarBefore = (await sidebar.boundingBox()).height;
  const sidebarToggle = mobile.locator("[data-sidebar-toggle]");
  await sidebarToggle.click();
  await mobile.waitForTimeout(520);
  const sidebarAfter = (await sidebar.boundingBox()).height;
  const detailOpacity = Number(
    await mobile.locator("[data-sidebar-details]").evaluate((element) => getComputedStyle(element).opacity),
  );
  assert.equal(await sidebarToggle.getAttribute("aria-expanded"), "true");
  assert.ok(sidebarAfter - sidebarBefore >= 120, `Sidebar expanded only ${sidebarAfter - sidebarBefore}px`);
  assert.ok(detailOpacity >= 0.95, "Expanded sidebar details are not visible");

  await mobile.getByRole("tab", { name: "About" }).click();
  await mobile.locator(".about-panel").waitFor({ state: "visible" });
  assert.match(await mobile.locator(".about-panel").innerText(), /About Me/);
  await mobile.screenshot({ path: resolve(outputDirectory, "mobile-expanded-about.png"), fullPage: true });

  const reduced = await browser.newPage({
    viewport: { width: 1280, height: 900 },
    reducedMotion: "reduce",
  });
  installErrorCollection(reduced, consoleErrors, "reduced-motion");
  await reduced.goto(address, { waitUntil: "domcontentloaded" });
  await reduced.locator("[data-motion='avatar']").waitFor({ state: "visible" });
  assert.equal(await reduced.locator(".video-preview").count(), 0, "Autoplay preview should stop for reduced motion");
  const reducedAvatarTravel = await axisRange(reduced.locator('[data-motion="avatar"]'), "y", 8, 100);
  assert.ok(reducedAvatarTravel <= 1, `Reduced-motion avatar still travels ${reducedAvatarTravel}px`);
  await reduced.getByRole("tab", { name: "About" }).click();
  await reduced.locator(".about-panel").waitFor({ state: "visible" });
  assert.match(await reduced.locator(".about-panel").innerText(), /About Me/);

  assert.deepEqual(consoleErrors, [], `First-party console errors: ${consoleErrors.join(" | ")}`);

  await browser.close();
  console.log(
    JSON.stringify(
      {
        desktop: {
          layout: desktopLayout,
          autoplayPreview: true,
          vengeanceAnimatedButton: true,
          vengeanceAnimatedNumber: true,
          avatarTravelPx: avatarTravel,
          playheadTravelPx: playheadTravel,
          pointerTiltDelta: Number(Math.abs(upperLeftTilt.m13 - lowerRightTilt.m13).toFixed(3)),
          cursorAuraTravelPx: Number(Math.abs(upperLeftAura.x - lowerRightAura.x).toFixed(1)),
          themeSwitch: true,
          keyboardTabs: true,
          processInteraction: true,
          videoDialogKeyboardAndEscape: true,
        },
        mobile: {
          layout: mobileLayout,
          fixedBottomNavigation: true,
          sidebarExpansionPx: Number((sidebarAfter - sidebarBefore).toFixed(1)),
          aboutPanel: true,
        },
        reducedMotion: {
          autoplayStopped: true,
          avatarTravelPx: reducedAvatarTravel,
          navigationStillWorks: true,
        },
        consoleErrors,
      },
      null,
      2,
    ),
  );
} finally {
  await server.close();
}
