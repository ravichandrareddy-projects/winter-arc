import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import puppeteer from "puppeteer-core";

const base = process.env.WINTERARC_TEST_URL || "http://127.0.0.1:3100";
const artifacts = await mkdtemp(path.join(process.env.WINTERARC_TEST_ARTIFACTS || tmpdir(), "winterarc-regressions-"));
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox"],
});
const context = await browser.createBrowserContext();
const page = await context.newPage();
await page.setViewport({ width: 1440, height: 1000 });
page.setDefaultTimeout(30000);
const errors = [];
const httpErrors = [];
let activePage = page;
function observe(target) {
  target.on("pageerror", (error) => errors.push(error.message));
  target.on("response", (response) => { if (response.status() >= 400) httpErrors.push(`${response.status()} ${response.url()}`); });
}
observe(page);
await page.evaluateOnNewDocument(() => {
  localStorage.setItem("wa-guest", "1");
  localStorage.setItem("wa-seen-intro", "1");
});

async function go(route, target = page) {
  activePage = target;
  await target.bringToFront();
  await target.goto(`${base}${route}`, { waitUntil: "domcontentloaded" });
  await target.waitForFunction(() => !!document.querySelector('button[aria-label="Edit your name"]'), { polling: 100 });
}
async function clickText(text, scope = "", target = page) {
  await target.waitForFunction((text, scope) => [...document.querySelectorAll(`${scope} button`)].some((button) =>
    button.getClientRects().length && !button.disabled && button.innerText.trim().toLowerCase() === text.toLowerCase()
  ), {}, text, scope);
  const handle = await target.evaluateHandle((text, scope) => {
    return [...document.querySelectorAll(`${scope} button`)].find((button) =>
      button.getClientRects().length && !button.disabled && button.innerText.trim().toLowerCase() === text.toLowerCase()
    );
  }, text, scope);
  const button = handle.asElement();
  assert(button, `Visible button not found: ${text}`);
  await button.evaluate((element) => element.scrollIntoView({ block: "center" }));
  await button.click();
  await handle.dispose();
}
async function fill(selector, value, target = page) {
  const input = await target.waitForSelector(selector);
  if (await input.evaluate((element) => element.type === "date")) {
    // Use the native setter so React receives the date-input change.
    await input.evaluate((element, value) => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(element, value);
      element.dispatchEvent(new Event("input", { bubbles: true }));
      element.dispatchEvent(new Event("change", { bubbles: true }));
    }, value);
  } else {
    await input.focus();
    await target.keyboard.down("Control");
    await target.keyboard.press("a");
    await target.keyboard.up("Control");
    await target.keyboard.press("Backspace");
    if (value) await target.keyboard.type(value);
  }
  await input.dispose();
}
const state = () => page.evaluate(() => JSON.parse(localStorage.getItem("winterarc-v2")).state);
let checks = 0;
function pass(name) { checks++; console.log(`PASS ${name}`); }

try {
  await go("/");
  const hero = await page.$eval('[aria-label="Winter Arc Motivation Hub"]', (element) => element.innerText);
  const sidebar = await page.$eval("aside", (element) => element.innerText);
  assert.deepEqual(hero.match(/(\d+) of (\d+)\s+tasks/).slice(1), sidebar.match(/(\d+) of (\d+) done/).slice(1));
  pass("scheduled tracker completion agrees across dashboard panels");

  await go("/settings");
  await clickText("Light");
  await page.waitForFunction(() => document.documentElement.classList.contains("light"));
  await go("/settings");
  assert.equal(await page.evaluate(() => localStorage.getItem("winterarc-theme")), "light");
  assert(await page.evaluate(() => document.documentElement.classList.contains("light")));
  pass("light theme persists after reload");
  await clickText("System");
  await page.emulateMediaFeatures([{ name: "prefers-color-scheme", value: "dark" }]);
  await page.waitForFunction(() => document.documentElement.classList.contains("dark"));
  await page.emulateMediaFeatures([{ name: "prefers-color-scheme", value: "light" }]);
  await page.waitForFunction(() => document.documentElement.classList.contains("light"));
  await clickText("Dark");
  pass("system theme follows operating-system changes");

  await fill("#pf-email", "not-an-email");
  await clickText("Save");
  await page.waitForSelector("#profile-error");
  assert.notEqual((await state()).profile.email, "not-an-email");
  await fill("#pf-email", "");
  pass("invalid profile emails are rejected");
  const originalEnd = (await state()).arc.endDate;
  await fill("#arc-end", "2000-01-01");
  await clickText("Save Dates");
  await page.waitForSelector("main [role=alert]");
  await fill("#arc-end", originalEnd);
  await clickText("Save Dates");
  await page.waitForFunction(() => !document.querySelector("main [role=alert]"));
  assert.equal(await page.$("main [role=alert]"), null);
  pass("date validation clears after a valid correction");

  await page.select("#arc-total", "30");
  await page.waitForFunction(() => [...document.querySelectorAll("button")].some((button) => button.innerText === "SAVE DATES"));
  await clickText("Save Dates");
  await go("/");
  const roadmap = await page.$eval('[aria-label="Winter Arc Roadmap"]', (element) => element.innerText);
  assert.match(roadmap, /30-Day Arc Roadmap/);
  for (const range of ["Days 1 – 10", "Days 11 – 20", "Days 21 – 30"]) assert(roadmap.includes(range));
  assert(!roadmap.includes("/ 90"));
  const shortened = await state();
  assert(shortened.trackers.every((tracker) => tracker.endDate === shortened.arc.endDate));
  pass("custom duration updates all phase ranges");

  for (const route of ["/sleep", "/wake-up"]) {
    await go(route);
    const labels = await page.evaluate(() => [...document.querySelectorAll("button[aria-label]")]
      .map((button) => button.getAttribute("aria-label")).filter((label) => /^\w+ \d+ \d+ [AP]M/.test(label)));
    const start = (await state()).arc.startDate;
    const label = await page.evaluate((start) => new Date(`${start}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" }), start);
    assert(labels.length > 0 && labels.every((value) => value.startsWith(label)));
  }
  pass("sleep and wake ranges never pad a new arc with future days");

  await go("/food");
  const beforeMeal = await state();
  await clickText("Add Meal");
  await clickText("Dinner", "dialog[open]");
  await fill("#meal-items", "QA regression dinner");
  await fill("#meal-calories", "350");
  await fill("#meal-protein", "25");
  await clickText("Add Meal", "dialog[open]");
  await page.waitForFunction(() => !document.querySelector("dialog[open]"));
  await go("/");
  const data = await state();
  const meals = data.meals.filter((meal) => meal.dateKey === data.selectedDate);
  for (const name of ["Food", "Protein"]) {
    const tracker = data.trackers.find((item) => item.name === name);
    const total = data.entries.filter((entry) => entry.date === data.selectedDate && entry.trackerId === tracker.id)
      .reduce((sum, entry) => sum + Number(entry.value), 0);
    assert.equal(total, name === "Food" ? meals.length : meals.reduce((sum, meal) => sum + meal.protein, 0));
  }
  pass("meal-derived Food and Protein totals persist on Home");

  async function editRegressionMeal() {
    const handle = await page.evaluateHandle(() => [...document.querySelectorAll('[role="row"]')]
      .find((row) => row.innerText.includes("QA regression dinner"))?.querySelector("button"));
    assert(handle.asElement(), "Regression meal edit button is present");
    await handle.asElement().click();
    await handle.dispose();
    await page.waitForSelector("dialog[open]");
  }
  await go("/food");
  await editRegressionMeal();
  await fill("#meal-protein", "40");
  await clickText("Save Changes", "dialog[open]");
  await go("/");
  const edited = await state();
  const proteinTracker = edited.trackers.find((tracker) => tracker.name === "Protein");
  assert.equal(edited.entries.filter((entry) => entry.date === edited.selectedDate && entry.trackerId === proteinTracker.id)
    .reduce((sum, entry) => sum + Number(entry.value), 0),
  edited.meals.filter((meal) => meal.dateKey === edited.selectedDate).reduce((sum, meal) => sum + meal.protein, 0));
  await go("/food");
  await editRegressionMeal();
  await clickText("Delete Meal", "dialog[open]");
  await go("/");
  const deleted = await state();
  assert.equal(deleted.meals.length, beforeMeal.meals.length);
  assert.equal(deleted.entries.filter((entry) => entry.date === deleted.selectedDate && entry.trackerId === proteinTracker.id)
    .reduce((sum, entry) => sum + Number(entry.value), 0),
  deleted.meals.filter((meal) => meal.dateKey === deleted.selectedDate).reduce((sum, meal) => sum + meal.protein, 0));
  pass("meal edits and deletion reconcile dashboard totals after reload");

  await clickText("Edit Goals");
  await page.waitForSelector("dialog[open]");
  for (let index = 0; index < 45; index++) {
    await page.keyboard.press("Tab");
    assert(await page.evaluate(() => !!document.activeElement.closest("dialog")));
  }
  await page.keyboard.press("Escape");
  await page.waitForFunction(() => !document.querySelector("dialog[open]"));
  assert.equal(await page.evaluate(() => document.activeElement.innerText), "Edit Goals");
  pass("sheets trap keyboard focus and support Escape");

  const previewContext = await browser.createBrowserContext();
  const previewPage = await previewContext.newPage();
  observe(previewPage);
  await previewPage.setViewport({ width: 1440, height: 1000 });
  await previewPage.evaluateOnNewDocument(() => localStorage.setItem("wa-seen-intro", "1"));
  await go("/", previewPage);
  await clickText("Edit Goals", "", previewPage);
  await previewPage.waitForSelector('dialog[open][aria-label="Sign in"]');
  await previewPage.setViewport({ width: 390, height: 844 });
  assert(await previewPage.evaluate(() => !!document.activeElement.closest("dialog")));
  for (let index = 0; index < 25; index++) {
    if (index % 2) await previewPage.keyboard.down("Shift");
    await previewPage.keyboard.press("Tab");
    if (index % 2) await previewPage.keyboard.up("Shift");
    assert(await previewPage.evaluate(() => !!document.activeElement.closest("dialog")));
  }
  await previewPage.keyboard.press("Escape");
  await previewPage.waitForFunction(() => !document.querySelector("dialog[open]"));
  assert.equal(await previewPage.evaluate(() => document.activeElement.innerText), "Edit Goals");
  await previewPage.setViewport({ width: 1440, height: 1000 });
  await clickText("Edit Goals", "", previewPage);
  await clickText("Continue as Guest (Store on device)", "dialog[open]", previewPage);
  await previewPage.waitForSelector('dialog[open][aria-label="Edit goals"]');
  assert.equal(await previewPage.evaluate(() => JSON.parse(localStorage.getItem("winterarc-v2")).state.dataMode), "local");
  await previewContext.close();
  pass("preview sign-in focuses, traps, dismisses, and resumes the guest action");

  const loginContext = await browser.createBrowserContext();
  const loginPage = await loginContext.newPage();
  observe(loginPage);
  activePage = loginPage;
  await loginPage.bringToFront();
  await loginPage.goto(`${base}/login`, { waitUntil: "domcontentloaded" });
  await loginPage.waitForSelector('a[href="/"]');
  const guestLink = await loginPage.evaluateHandle(() => [...document.querySelectorAll("a")]
    .find((link) => link.innerText.trim() === "Continue as Guest (Preview Mode)"));
  assert(guestLink.asElement());
  await guestLink.asElement().click();
  await guestLink.dispose();
  await loginPage.waitForSelector('[aria-label="Winter Arc Motivation Hub"]');
  await loginContext.close();
  pass("Login guest entry reaches the dashboard");

  for (const width of [320, 390]) {
    activePage = page;
    await page.bringToFront();
    await page.setViewport({ width, height: 844 });
    for (const route of ["/", "/sleep", "/wake-up", "/fitness", "/food", "/progress", "/settings", "/intro"]) {
      await page.goto(`${base}${route}`, { waitUntil: "domcontentloaded" });
      await page.waitForSelector(route === "/intro" ? "#intro-top-enter-btn" : 'button[aria-label="Edit your name"]');
      const documentWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      assert(documentWidth <= width + 1, `${route} overflows at ${width}px (${documentWidth}px)`);
      if (route === "/intro") {
        const rect = await page.$eval("#intro-top-enter-btn", (element) => element.getBoundingClientRect().toJSON());
        assert(rect.right <= width);
      }
    }
  }
  await page.setViewport({ width: 1440, height: 1000 });
  pass("320px and 390px layouts fit, including the Intro entry button");
  await go("/settings");
  await page.select("#pf-tab", "/food");
  await go("/");
  await page.waitForFunction(() => location.pathname === "/food");
  await go("/settings");
  await page.select("#pf-tab", "/");
  pass("Default Start Tab is respected on reopening");

  await go("/fitness/photos");
  const imagePath = path.join(artifacts, "test-photo.png");
  await page.screenshot({ path: imagePath });
  const fileInputs = await page.$$("input[type=file]");
  await fileInputs[fileInputs.length - 1].uploadFile(imagePath);
  await clickText("Save Photo");
  await page.waitForFunction(() => document.querySelector('main img[alt^="front "]')?.naturalWidth > 0);
  await go("/fitness/photos");
  await page.waitForFunction(() => document.querySelector('main img[alt^="front "]')?.naturalWidth > 0);
  pass("photo upload and same-device reload keep the image");

  await go("/settings");
  const session = await page.createCDPSession();
  await session.send("Browser.setDownloadBehavior", { behavior: "allow", downloadPath: artifacts, browserContextId: context.id });
  await page.evaluate(() => {
    const original = URL.createObjectURL;
    URL.createObjectURL = (blob) => {
      if (blob.type === "application/json") void blob.text().then((text) => { window.__winterarcBackup = text; });
      return original(blob);
    };
  });
  await clickText("Save Backup File to Device (.json)");
  await page.waitForFunction(() => !!window.__winterarcBackup);
  const backupText = await page.evaluate(() => window.__winterarcBackup);
  const backup = JSON.parse(backupText);
  assert.equal(backup.version, 2);
  assert.equal(backup.photos.length, 1);
  assert.match(backup.photos[0].dataUrl, /^data:image\/png;base64,/);
  const backupPath = path.join(artifacts, "backup.json");
  await writeFile(backupPath, backupText);
  assert.equal(JSON.parse(await readFile(backupPath, "utf8")).photos.length, 1);
  const freshContext = await browser.createBrowserContext();
  const freshPage = await freshContext.newPage();
  observe(freshPage);
  await freshPage.evaluateOnNewDocument(() => { localStorage.setItem("wa-guest", "1"); localStorage.setItem("wa-seen-intro", "1"); });
  await go("/settings", freshPage);
  await (await freshPage.$("input[type=file]")).uploadFile(backupPath);
  await freshPage.waitForFunction(() => document.body.innerText.includes("Backup restored, including photo files."));
  await go("/fitness/photos", freshPage);
  await freshPage.waitForFunction(() => document.querySelector('main img[alt^="front "]')?.naturalWidth > 0);
  await freshContext.close();
  pass("complete photo-inclusive backup restores in a fresh browser");

  const legacyPath = path.join(artifacts, "legacy-backup.json");
  await writeFile(legacyPath, JSON.stringify({ app: "winterarc", version: 1, data: backup.data }));
  const legacyContext = await browser.createBrowserContext();
  const legacyPage = await legacyContext.newPage();
  observe(legacyPage);
  await legacyPage.evaluateOnNewDocument(() => { localStorage.setItem("wa-guest", "1"); localStorage.setItem("wa-seen-intro", "1"); });
  await go("/settings", legacyPage);
  await (await legacyPage.$("input[type=file]")).uploadFile(legacyPath);
  await legacyPage.waitForFunction(() => document.body.innerText.includes("1 photo files are missing from this older backup"));
  await go("/fitness/photos", legacyPage);
  await legacyPage.waitForFunction(() => document.body.innerText.includes("Photo file unavailable"));
  await legacyContext.close();
  activePage = page;
  pass("legacy metadata-only backups identify missing photo files");

  await clickText("Clear All Local Data");
  await clickText("Tap again to confirm wipe");
  await page.waitForFunction(() => document.body.innerText.includes("All tracking entries, meals, and photos cleared."));
  await go("/");
  const empty = await state();
  assert.equal(empty.entries.length, 0);
  assert.equal(empty.meals.length, 0);
  assert.equal(empty.photoMeta.length, 0);
  assert.equal(empty.dataMode, "local");
  pass("cleared local history stays empty after reload");

  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.waitForFunction(() => !!navigator.serviceWorker.controller);
  await go("/settings");
  await page.setOfflineMode(true);
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForSelector("#pf-name");
  await page.setOfflineMode(false);
  pass("previously opened tracking pages reopen offline");
  assert.deepEqual(errors, []);
  assert.deepEqual(httpErrors, []);
  pass("no hydration exceptions or static-resource HTTP errors");
  console.log(`\n${checks} regression checks passed. Artifacts: ${artifacts}`);
} catch (error) {
  console.error(error);
  if (errors.length || httpErrors.length) console.error({ errors, httpErrors });
  await writeFile(path.join(artifacts, "failure.json"), JSON.stringify({
    error: String(error), errors, httpErrors,
    page: await activePage.evaluate(() => ({ url: location.href, text: document.body.innerText, intro: localStorage.getItem("wa-seen-intro") })).catch(() => null),
  }, null, 2));
  await activePage.screenshot({ path: path.join(artifacts, "failure.png"), fullPage: true }).catch(() => {});
  console.error(`Failure artifacts: ${artifacts}`);
  process.exitCode = 1;
} finally {
  await browser.close();
}
