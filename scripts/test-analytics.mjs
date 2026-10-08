import assert from "node:assert/strict";
import puppeteer from "puppeteer-core";

const base = process.env.WINTERARC_TEST_URL || "http://127.0.0.1:3100";
const expectedMeasurementId = process.env.WINTERARC_EXPECT_GA || "";
const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || "/usr/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox"],
});

try {
  const page = await browser.newPage();
  const analyticsRequests = [];
  await page.setRequestInterception(true);
  page.on("request", (request) => {
    if (request.url().includes("googletagmanager.com/gtag/js")) {
      analyticsRequests.push(request.url());
      return request.abort();
    }
    return request.continue();
  });

  const response = await page.goto(`${base}/?email=not-for-analytics`, {
    waitUntil: "domcontentloaded",
    timeout: 30000,
  });
  await page.waitForSelector("h1");
  await new Promise((resolve) => setTimeout(resolve, 500));

  const csp = response.headers()["content-security-policy"] || "";
  const state = await page.evaluate(() => ({
    script: document.querySelector('script[src*="googletagmanager.com/gtag/js"]')?.getAttribute("src") || "",
    dataLayer: window.dataLayer?.map((entry) => Array.from(entry)) || [],
  }));

  if (expectedMeasurementId) {
    assert.equal(state.script, `https://www.googletagmanager.com/gtag/js?id=${expectedMeasurementId}`);
    assert.equal(analyticsRequests.length, 1);
    assert(csp.includes("https://www.googletagmanager.com"));
    assert(csp.includes("https://*.google-analytics.com"));

    const serializedDataLayer = JSON.stringify(state.dataLayer);
    assert(serializedDataLayer.includes("page_view"));
    assert(!serializedDataLayer.includes("not-for-analytics"));
    assert(serializedDataLayer.includes("winterarc.indevs.in") || serializedDataLayer.includes("127.0.0.1"));
    console.log(`PASS analytics enabled with ${expectedMeasurementId} and query strings excluded`);
  } else {
    assert.equal(state.script, "");
    assert.equal(analyticsRequests.length, 0);
    assert(!csp.includes("googletagmanager.com"));
    assert(!csp.includes("google-analytics.com"));
    assert.deepEqual(state.dataLayer, []);
    console.log("PASS analytics disabled without a measurement ID");
  }
} finally {
  await browser.close();
}
