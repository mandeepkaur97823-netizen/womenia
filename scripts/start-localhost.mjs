import { spawn, exec } from "node:child_process";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

const DEFAULT_PORT = 8080;
let detectedUrl = `http://localhost:${DEFAULT_PORT}`;
let browserOpened = false;

console.log("=================================================");
console.log("             WOMANIA LOCALHOST SERVER            ");
console.log("=================================================");
console.log(`Starting WOMANIA Localhost Server...`);
console.log(`Default URL: ${detectedUrl}`);
console.log("Your browser will open automatically once ready.");
console.log("Press Ctrl+C at any time to stop the server.");
console.log("=================================================\n");

// Determine the best execution method:
// 1. If running under Node, invoke local Vite CLI directly (starts in ~1.4s, avoids wrapper delays)
// 2. If running under Bun, use bun run dev
// 3. Fallback to npm run dev
const isBunRuntime = typeof process.versions.bun !== "undefined";
const viteCliPath = path.join(rootDir, "node_modules", "vite", "bin", "vite.js");

let command = "";
let args = [];

if (!isBunRuntime && fs.existsSync(viteCliPath)) {
  command = process.execPath;
  args = [viteCliPath, "dev", "--port", "8080"];
} else if (isBunRuntime) {
  command = "bun";
  args = ["run", "dev", "--port", "8080"];
} else {
  command = process.platform === "win32" ? "npm.cmd" : "npm";
  args = ["run", "dev", "--", "--port", "8080"];
}

const serverProcess = spawn(command, args, {
  cwd: rootDir,
  stdio: ["inherit", "pipe", "inherit"],
  env: { ...process.env, FORCE_COLOR: "1" }
});

function openBrowser(targetUrl) {
  if (browserOpened) return;
  browserOpened = true;

  const baseUrl = targetUrl.replace(/\/+$/, "");

  console.log("\n=================================================");
  console.log("   WOMANIA BOUTIQUE - LOCAL SERVER IS LIVE!     ");
  console.log("=================================================");
  console.log(`  --> Storefront:  ${baseUrl}/`);
  console.log(`  --> Shop:        ${baseUrl}/shop`);
  console.log(`  --> Collections: ${baseUrl}/collections`);
  console.log(`  --> Order Track: ${baseUrl}/track-order`);
  console.log(`  --> Admin:       ${baseUrl}/admin`);
  console.log(`                   * Super Admin PIN: 123456789`);
  console.log(`                   * Staff Admin PIN: 12345678`);
  console.log("-------------------------------------------------");
  console.log(" [!] IMPORTANT: KEEP THIS WINDOW OPEN!");
  console.log("     Closing this terminal window will stop the server.");
  console.log("     Press Ctrl+C in this window when you want to stop.");
  console.log("=================================================\n");

  const openCmd =
    process.platform === "win32"
      ? `start "" "${targetUrl}"`
      : process.platform === "darwin"
        ? `open "${targetUrl}"`
        : `xdg-open "${targetUrl}"`;

  exec(openCmd, (err) => {
    if (err) {
      console.log(`[WOMANIA] Notice: Please open manually at: ${targetUrl}`);
    }
  });
}

function pollHttp(urlToPoll) {
  if (browserOpened) return;

  const req = http.get(urlToPoll, (res) => {
    if (res.statusCode && res.statusCode < 500) {
      openBrowser(urlToPoll);
    } else {
      setTimeout(() => pollHttp(urlToPoll), 600);
    }
  });

  req.on("error", () => {
    setTimeout(() => pollHttp(urlToPoll), 600);
  });

  req.end();
}

// Strip ANSI escape sequences from Vite terminal output
function stripAnsi(str) {
  return str.replace(/\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])/g, "");
}

// Start polling immediately so browser opens the exact moment Vite is ready
pollHttp(detectedUrl);

// Intercept stdout to detect if Vite bound to 8080 or an alternate port (e.g. if 8080 was busy)
serverProcess.stdout.on("data", (chunk) => {
  const text = chunk.toString();
  process.stdout.write(text);

  const clean = stripAnsi(text);
  const match = clean.match(/Local:\s+(https?:\/\/(?:localhost|127\.0\.0\.1):\d+\/?)/i);
  if (match && match[1]) {
    const liveUrl = match[1].trim();
    if (liveUrl !== detectedUrl) {
      detectedUrl = liveUrl;
    }
    if (!browserOpened) {
      pollHttp(detectedUrl);
    }
  }
});

// Fallback: continue polling detectedUrl until opened
const pollInterval = setInterval(() => {
  if (browserOpened) {
    clearInterval(pollInterval);
  } else {
    pollHttp(detectedUrl);
  }
}, 1000);

serverProcess.on("exit", (code) => {
  console.log(`\n[WOMANIA] Server stopped (exit code: ${code}).`);
  process.exit(code ?? 0);
});

process.on("SIGINT", () => {
  serverProcess.kill("SIGINT");
  process.exit(0);
});

process.on("SIGTERM", () => {
  serverProcess.kill("SIGTERM");
  process.exit(0);
});

