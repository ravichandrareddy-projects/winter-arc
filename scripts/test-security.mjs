import assert from "node:assert/strict";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import puppeteer from "puppeteer-core";

const base = process.env.WINTERARC_TEST_URL || "http://127.0.0.1:3100";
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox"],
});
const context = await browser.createBrowserContext();
const page = await context.newPage();
page.setDefaultTimeout(30000);
await page.evaluateOnNewDocument(() => {
  localStorage.setItem("wa-guest", "1");
  localStorage.setItem("wa-seen-intro", "1");
});

const onePixelPng = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";
const artifactDir = await mkdtemp(path.join(process.env.WINTERARC_TEST_ARTIFACTS || tmpdir(), "winterarc-security-"));
const maliciousBackup = path.join(artifactDir, "winterarc-malicious-security-backup.json");

try {
  const response = await page.goto(`${base}/settings`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("#pf-name");
  const headers = response.headers();
  for (const name of ["content-security-policy", "x-frame-options", "x-content-type-options", "referrer-policy"]) {
    assert(headers[name], `Missing ${name} security header`);
  }
  assert.match(headers["content-security-policy"], /object-src 'none'/);
  console.log("PASS security headers are present");

  const state = await page.evaluate(() => JSON.parse(localStorage.getItem("winterarc-v2")));
  state.state.preferences.startTab = "javascript:globalThis.__winterarcSecurityProbe=1";
  state.state.photoMeta = [{ id: "../other-user/secret", dateKey: state.state.selectedDate, angle: "front", createdAt: new Date().toISOString() }];
  await writeFile(maliciousBackup, JSON.stringify({
    app: "winterarc", version: 2, data: state.state,
    photos: [{ id: "../other-user/secret", dataUrl: `data:image/png;base64,${onePixelPng}` }],
  }));
  await (await page.$("input[type=file]")).uploadFile(maliciousBackup);
  await page.waitForFunction(() => document.body.innerText.includes("Couldn't restore this backup"));
  console.log("PASS backup photo path traversal is rejected");

  await page.evaluate(() => localStorage.setItem("winterarc-v2", JSON.stringify({
    ...JSON.parse(localStorage.getItem("winterarc-v2")),
    state: { ...JSON.parse(localStorage.getItem("winterarc-v2")).state, preferences: { ...JSON.parse(localStorage.getItem("winterarc-v2")).state.preferences, startTab: "javascript:globalThis.__winterarcSecurityProbe=1" } },
  })));
  await page.goto(`${base}/`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector('button[aria-label="Edit your name"]');
  await new Promise((resolve) => setTimeout(resolve, 500));
  assert.equal(page.url(), `${base}/`);
  assert.equal(await page.evaluate(() => globalThis.__winterarcSecurityProbe ?? false), false);
  console.log("PASS persisted router destinations cannot execute javascript URLs");

  const callback = await fetch(`${base}/auth/callback?next=https%3A%2F%2Fattacker.example%2F`, { redirect: "manual" });
  assert.equal(callback.status, 307);
  const callbackLocation = new URL(callback.headers.get("location"), base);
  assert.notEqual(callbackLocation.hostname, "attacker.example");
  assert.equal(callbackLocation.pathname, "/");
  assert.equal(callbackLocation.search, "?auth_error=1");
  console.log("PASS auth callback rejects external redirect destinations");
} finally {
  await browser.close();
}
