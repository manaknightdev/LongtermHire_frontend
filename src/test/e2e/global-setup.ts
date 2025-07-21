async function globalSetup() {
  console.log("🎭 Running Playwright global setup...");
  // Ensure browsers are installed before running tests
  const { execSync } = require("child_process");
  try {
    console.log("📥 Installing Playwright browsers...");
    execSync("npx playwright install", { stdio: "inherit" });
    console.log("✅ Playwright browsers installed successfully");
  } catch (error) {
    console.error("❌ Failed to install Playwright browsers:", error);
    process.exit(1);
  }
}

export default globalSetup;
