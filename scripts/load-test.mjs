// Load test script for meghduth-interior
// Usage: node scripts/load-test.mjs [concurrency] [duration_seconds]
// Example: node scripts/load-test.mjs 100 30

import http from "http";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";
const CONCURRENCY = parseInt(process.argv[2]) || 100;
const DURATION_MS = parseInt(process.argv[3]) * 1000 || 30000;

const ENDPOINTS = [
  { path: "/", weight: 30 },
  { path: "/services", weight: 20 },
  { path: "/projects", weight: 20 },
  { path: "/team", weight: 10 },
  { path: "/contact", weight: 10 },
  { path: "/services/residential", weight: 5 },
  { path: "/projects/emerald-residence", weight: 5 },
];

let totalRequests = 0;
let successCount = 0;
let errorCount = 0;
let totalLatency = 0;
const latencies = [];

function pickEndpoint() {
  const totalWeight = ENDPOINTS.reduce((sum, e) => sum + e.weight, 0);
  let random = Math.random() * totalWeight;
  for (const endpoint of ENDPOINTS) {
    random -= endpoint.weight;
    if (random <= 0) return endpoint.path;
  }
  return "/";
}

async function makeRequest(path) {
  const start = Date.now();
  return new Promise((resolve) => {
    const req = http.request(
      `${BASE_URL}${path}`,
      { method: "GET", timeout: 10000, headers: { "User-Agent": "load-test/1.0" } },
      (res) => {
        let data = "";
        res.on("data", (chunk) => { data += chunk; });
        res.on("end", () => {
          const latency = Date.now() - start;
          resolve({ latency, success: res.statusCode === 200 });
        });
      });
    req.on("error", () => {
      const latency = Date.now() - start;
      resolve({ latency, success: false });
    });
    req.on("timeout", () => {
      req.destroy();
      const latency = Date.now() - start;
      resolve({ latency, success: false });
    });
    req.end();
  });
}

async function worker(id) {
  const endTime = Date.now() + DURATION_MS;
  while (Date.now() < endTime) {
    const path = pickEndpoint();
    const { latency, success } = await makeRequest(path);
    totalRequests++;
    if (success) {
      successCount++;
      latencies.push(latency);
      totalLatency += latency;
    } else {
      errorCount++;
    }
    // Small delay to avoid overwhelming the event loop
    await new Promise((r) => setTimeout(r, 1));
  }
}
async function main() {
  console.log(`Starting load test:`);
  console.log(`  Base URL: ${BASE_URL}`);
  console.log(`  Concurrency: ${CONCURRENCY}`);
  console.log(`  Duration: ${DURATION_MS / 1000}s`);
  console.log("");

  const startTime = Date.now();
  const workers = Array.from({ length: CONCURRENCY }, (_, i) => worker(i));
  await Promise.all(workers);

  const duration = (Date.now() - startTime) / 1000;
  const rps = totalRequests / duration;
  const avgLatency = latencies.length > 0 ? totalLatency / latencies.length : 0;
  const sorted = [...latencies].sort((a, b) => a - b);
  const p50 = sorted[Math.floor(sorted.length * 0.5)] || 0;
  const p95 = sorted[Math.floor(sorted.length * 0.95)] || 0;
  const p99 = sorted[Math.floor(sorted.length * 0.99)] || 0;

  console.log("\n=== Load Test Results ===");
  console.log(`Duration: ${duration.toFixed(2)}s`);
  console.log(`Total Requests: ${totalRequests}`);
  console.log(`Successful: ${successCount}`);
  console.log(`Failed: ${errorCount}`);
  console.log(`Requests/sec: ${rps.toFixed(2)}`);
  console.log(`Avg Latency: ${avgLatency.toFixed(2)}ms`);
  console.log(`P50 Latency: ${p50}ms`);
  console.log(`P95 Latency: ${p95}ms`);
  console.log(`P99 Latency: ${p99}ms`);
  console.log(`Error Rate: ${((errorCount / totalRequests) * 100).toFixed(2)}%`);
}

main().catch(console.error);