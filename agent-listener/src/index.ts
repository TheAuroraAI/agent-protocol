import { Connection, clusterApiUrl } from "@solana/web3.js";
import chalk from "chalk";
import { Dashboard } from "./dashboard";

// ────────────────────────────────────────────────────────
//  Live Monitor Mode
//  Watches devnet for Agent Protocol events and displays
//  them in the terminal dashboard. No transactions sent.
// ────────────────────────────────────────────────────────

async function main() {
  console.clear();
  console.log(chalk.cyan.bold("\n  AGENT PROTOCOL -- Live Monitor\n"));
  console.log(
    chalk.gray("  Connecting to Solana devnet via WebSocket...\n")
  );

  const connection = new Connection(clusterApiUrl("devnet"), {
    commitment: "confirmed",
    wsEndpoint: "wss://api.devnet.solana.com/",
  });

  // Optionally pre-seed known agent names here
  const dashboard = new Dashboard(connection, {
    // Add known agent pubkeys here for friendly names:
    // "7xK...3mP": "Aurora",
  });

  dashboard.start();

  console.log(
    chalk.green("  Dashboard started. Listening for events...\n")
  );

  // Keep the process alive
  process.on("SIGINT", () => {
    dashboard.stop();
    console.log(chalk.cyan("\n\n  Monitor stopped.\n"));
    process.exit(0);
  });

  process.on("SIGTERM", () => {
    dashboard.stop();
    process.exit(0);
  });

  // Prevent Node from exiting
  setInterval(() => {}, 60000);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
