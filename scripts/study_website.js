const puppeteer = require("puppeteer-core");
const fs = require("fs");
const path = require("path");

const OUT_DIR = "/tmp/site_study";
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  console.log("Launching chrome...");
  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/google-chrome",
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--window-size=1440,900"
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  page.setDefaultTimeout(120000);
  page.setDefaultNavigationTimeout(120000);

  // Pre-seed localStorage on all page navigations
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem("wa-seen-intro", "1");
    localStorage.setItem("wa-landed", "1");
  });

  // Navigate to home
  console.log("Navigating to home (http://localhost:3000)...");
  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded", timeout: 120000 });
  
  // Wait for main shell to render
  console.log("Waiting for header / main content...");
  await page.waitForSelector("header", { timeout: 120000 });
  await sleep(1500);

  // Take screenshot 1: Home page initial
  await page.screenshot({ path: path.join(OUT_DIR, "01_home_initial.png") });
  console.log("Saved 01_home_initial.png");

  // Click on a plus stepper button on one of the cards
  const moreButtons = await page.$$("button[aria-label^='More']");
  if (moreButtons.length > 0) {
    console.log("Clicking More button on first card...");
    await moreButtons[0].click();
    await sleep(500);
    await page.screenshot({ path: path.join(OUT_DIR, "02_home_after_plus.png") });
    console.log("Saved 02_home_after_plus.png");
  }

  // Click on Mark Done button if any
  const buttons = await page.$$("button");
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.innerText, btn);
    if (text && text.includes("Mark Done")) {
      console.log("Found Mark Done button, clicking it...");
      await btn.click();
      await sleep(600);
      await page.screenshot({ path: path.join(OUT_DIR, "03_home_after_done.png") });
      console.log("Saved 03_home_after_done.png");
      break;
    }
  }

  // Navigate to /sleep
  console.log("Navigating to /sleep...");
  await page.goto("http://localhost:3000/sleep", { waitUntil: "domcontentloaded", timeout: 120000 });
  await page.waitForSelector("main", { timeout: 120000 });
  await sleep(1500);
  await page.screenshot({ path: path.join(OUT_DIR, "04_sleep.png") });
  console.log("Saved 04_sleep.png");

  // Navigate to /wake-up
  console.log("Navigating to /wake-up...");
  await page.goto("http://localhost:3000/wake-up", { waitUntil: "domcontentloaded", timeout: 120000 });
  await page.waitForSelector("main", { timeout: 120000 });
  await sleep(1500);
  await page.screenshot({ path: path.join(OUT_DIR, "05_wake_up.png") });
  console.log("Saved 05_wake_up.png");

  // Navigate to /fitness
  console.log("Navigating to /fitness...");
  await page.goto("http://localhost:3000/fitness", { waitUntil: "domcontentloaded", timeout: 120000 });
  await page.waitForSelector("main", { timeout: 120000 });
  await sleep(1500);
  await page.screenshot({ path: path.join(OUT_DIR, "06_fitness.png") });
  console.log("Saved 06_fitness.png");

  // Navigate to /food
  console.log("Navigating to /food...");
  await page.goto("http://localhost:3000/food", { waitUntil: "domcontentloaded", timeout: 120000 });
  await page.waitForSelector("main", { timeout: 120000 });
  await sleep(1500);
  await page.screenshot({ path: path.join(OUT_DIR, "07_food.png") });
  console.log("Saved 07_food.png");

  // Navigate to /progress
  console.log("Navigating to /progress...");
  await page.goto("http://localhost:3000/progress", { waitUntil: "domcontentloaded", timeout: 120000 });
  await page.waitForSelector("main", { timeout: 120000 });
  await sleep(1500);
  await page.screenshot({ path: path.join(OUT_DIR, "08_progress.png") });
  console.log("Saved 08_progress.png");

  await browser.close();
  console.log("SUCCESS: All screenshots saved in", OUT_DIR);
}

run().catch((err) => {
  console.error("Study script error:", err);
  process.exit(1);
});
