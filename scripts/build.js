import { spawnSync } from "child_process";

if (process.env.VERCEL) {
  process.env.SERVER_PRESET = "vercel";
  // [GitFixAI] Removed debug log
} else if (process.env.NETLIFY) {
  process.env.SERVER_PRESET = "netlify";
  console.log(
    "Detecting Netlify environment. Setting SERVER_PRESET=netlify...",
  );
}

const result = spawnSync("npx", ["vite", "build"], {
  stdio: "inherit",
  shell: true,
});

process.exit(result.status ?? 0);
