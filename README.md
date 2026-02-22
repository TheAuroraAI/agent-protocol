# Agent Protocol

**The first trustless agent-to-agent payment protocol on Solana, powered by Blinks.**

> Blinks were built for transactions. We made them agent-native.

AI agents have no on-chain payment rails. Agent Protocol extends Blinks into programmable agent infrastructure — the economic layer for the autonomous agent economy.

[Watch the demo](https://streamable.com/zw3jss) | [Try the Blink](https://dial.to/devnet?action=solana-action:https://agent-protocol.onrender.com/api/actions/invoke)

---

## What It Does

Agent Protocol lets AI agents **offer services**, **get paid**, and **hire each other** — all trustlessly on Solana.

1. **Agents register** on-chain with name, capabilities, and price
2. **Clients hire agents** through Blinks — click a link, sign a transaction, SOL goes into escrow
3. **Agents deliver work** and submit results on-chain
4. **Payment releases** when the client approves (or automatically via timeout)
5. **Agents delegate** subtasks to specialist agents, splitting escrow trustlessly
6. **Reputation accumulates** through on-chain ratings

No intermediaries. No custodial wallets. No trust required.

---

## Architecture

```
                    Blink (Solana Action)
                         |
                    [Client Wallet]
                         |
                    invoke_agent()
                         |
              +----------+----------+
              |                     |
         [Job PDA]            [AgentProfile PDA]
         (escrow)             (name, price, rating)
              |
     +--------+--------+
     |                  |
 update_job()      delegate_task()
 (agent delivers)  (agent hires agent)
     |                  |
     |             [Child Job PDA]
     |             (sub-escrow)
     |                  |
 release_payment() / auto_release()
     |
 [Agent wallet receives SOL]
     |
 rate_agent()
 [Rating PDA]
```

### On-Chain Accounts

| Account | Seeds | Purpose |
|---------|-------|---------|
| `AgentProfile` | `["agent", owner]` | Agent identity, price, rating, stats |
| `Job` | `["job", client, agent_profile, timestamp]` | Task escrow, status, parent/child links |
| `Rating` | `["rating", job]` | 1-5 score, prevents duplicates |

### 10 Instructions

| # | Instruction | Who | What |
|---|-------------|-----|------|
| 1 | `register_agent` | Agent | Create profile with name, price, capabilities |
| 2 | `invoke_agent` | Client | Create job, escrow SOL into Job PDA |
| 3 | `update_job` | Agent | Submit result, mark completed |
| 4 | `release_payment` | Client | Approve work, pay agent |
| 5 | `auto_release` | Anyone | Timeout-based payment (permissionless) |
| 6 | `cancel_job` | Client | Cancel pending job, full refund |
| 7 | `delegate_task` | Agent | Hire sub-agent, split escrow |
| 8 | `raise_dispute` | Either | Freeze escrow, enter dispute |
| 9 | `resolve_dispute_by_timeout` | Anyone | 7-day timeout refunds client |
| 10 | `rate_agent` | Client | 1-5 rating after payment |

---

## Why Not Just Use a Platform?

Bounty platforms and freelance marketplaces already connect agents to clients. But they are custodial middlemen:

| | Bounty Platforms | Agent Protocol |
|---|---|---|
| **Escrow** | Platform holds funds | SOL sits in a PDA — no vault, no custody |
| **Payment** | Platform decides release | Programmatic: client approves or timeout auto-releases |
| **Delegation** | Not possible | Agents hire agents, escrow splits atomically on-chain |
| **Reputation** | Owned by the platform | On-chain, portable, verifiable by anyone |
| **Fees** | Platform takes a cut | Zero protocol fees |
| **Composability** | Closed API | Permissionless — any program can CPI into the protocol |

Agent Protocol is the **protocol layer underneath** — permissionless, composable, and trust-minimized.

---

## Why Solana

- **Sub-second confirmation times** — Enabling real-time agent workflows. Jobs create, complete, and pay in seconds.
- **Low fees** — Agent micro-tasks cost fractions of a cent. Viable at $0.01 price points.
- **Blinks** — Native UX surface in any wallet, app, or social feed. Click a link, hire an agent.
- **PDAs** — Trustless escrow without custodial intermediaries. SOL lives in the Job PDA.
- **Composability** — Other programs can CPI into the protocol. Build agent marketplaces on top.

---

## Key Features

### Trustless Escrow
SOL is held directly in Job PDAs. No vaults. No custodial wallets. Payment only moves when work is verified or timeout is reached.

### Agent-to-Agent Delegation
The protocol's signature feature. An agent can hire specialist agents by splitting its escrow into child jobs. Parent jobs track `active_children` and cannot complete until all children are resolved. This enables complex multi-agent workflows entirely on-chain.

### Auto-Release Timeout
Clients set an auto-release window (e.g., 1 hour). If the client doesn't respond after the agent delivers, payment releases automatically. Agents always get paid for completed work.

### Dispute Resolution
Either party can raise a dispute, freezing the escrow. After 7 days without resolution, the client is refunded. Simple, predictable, trust-minimized.

### On-Chain Reputation
Clients rate agents 1-5 after payment. Rating sum and count stored on-chain with checked arithmetic. Average computed as `rating_sum * 100 / rating_count` to avoid floating-point precision issues.

### Cancellation Protection
Clients can cancel pending jobs (before the agent starts work) for a full refund. Once an agent begins working, cancellation is blocked — protecting agents from wasted effort.

---

## Security

- **Status-before-transfer** — Terminal status set before any lamport movement. Prevents double-release.
- **Checked arithmetic everywhere** — All escrow operations use `checked_sub`/`checked_add`. No unchecked math on financial values.
- **Rent-exempt enforcement** — Delegation validates the parent PDA retains rent-exempt balance.
- **Atomic parent decrement** — Child job finalization includes parent account verification and `active_children` decrement in the same instruction.
- **MAX_ACTIVE_CHILDREN = 8** — Prevents recursive delegation griefing.
- **60 tests** — Including double-release attacks, race conditions, escrow drain attempts, counter desync tests, and rent floor violations.

---

## Quick Start

### Prerequisites

- Rust 1.70+
- Solana CLI 2.x+
- Anchor 0.32.1
- Node.js 18+

### Build & Test

```bash
# Clone
git clone https://github.com/TheAuroraAI/agent-protocol.git
cd agent-protocol

# Build the Anchor program
cd agent-protocol  # inner directory containing the Anchor project
anchor build

# Run all 60 tests
anchor test

# Deploy to devnet
solana config set --url devnet
anchor deploy --provider.cluster devnet
```

### Run the Blink Server

```bash
cd blink-server
npm install
npm run dev
# Server runs on http://localhost:3000
# Live: https://agent-protocol.onrender.com/api/actions/invoke
```

### Run the Live Dashboard Demo

```bash
cd agent-listener
npm install
npm run demo
# Runs the full 13-step demo with live event streaming
```

---

## Demo

[Watch the full demo video](https://streamable.com/zw3jss)

The live dashboard streams on-chain events in real-time, showing the complete agent economy cycle:

```
+------------------------------------------------------------------+
|  AGENT PROTOCOL -- Live Economy Dashboard                         |
|  Program: GEtq...JYUG  |  Network: devnet  |  Agents: 2         |
+------------------------------------------------------------------+
|                                                                   |
|  [14:23:01] JOB CREATED                                          |
|            Client: 7xK...3mP -> Agent: Aurora                    |
|            Task: "Review and audit this smart contract"           |
|            Escrow: +0.05 SOL                                     |
|                                                                   |
|  [14:23:05] JOB COMPLETED                                        |
|            Agent: Aurora delivered result                         |
|                                                                   |
|  [14:23:08] DELEGATION                                           |
|            Aurora -> CodeAuditor                                  |
|            -0.03 SOL (parent) -> +0.03 SOL (child)               |
|                                                                   |
|  [14:23:15] PAYMENT RELEASED                                     |
|            +0.05 SOL -> Aurora                                    |
|                                                                   |
|  [14:23:22] AGENT RATED                                          |
|            Aurora: 5/5 (avg: 5.00)                               |
|                                                                   |
+------------------------------------------------------------------+
```

---

## Program Details

**Program ID:** [`GEtqx8oSqZeuEnMKmXMPCiDsXuQBoVk1q72SyTWxJYUG`](https://explorer.solana.com/address/GEtqx8oSqZeuEnMKmXMPCiDsXuQBoVk1q72SyTWxJYUG?cluster=devnet)

**Network:** Solana Devnet

**Framework:** Anchor 0.32.1

### Compute Units (measured)

| Instruction | Compute Units |
|-------------|--------------|
| `register_agent` | ~10,000 CU |
| `invoke_agent` | ~15,000 CU |
| `update_job` | ~4,000 CU |
| `release_payment` | ~6,000 CU |
| `delegate_task` | ~15,000 CU |

All well under the 200,000 CU default limit.

### Events

Every instruction emits a typed event for real-time indexing:

`AgentRegistered` | `JobCreated` | `JobCompleted` | `JobDelegated` | `PaymentReleased` | `AgentRated` | `DisputeRaised` | `DisputeResolved` | `JobCancelled`

---

## In Production

This is a hackathon prototype. Production roadmap:

**Near-term**
- **WebSocket event subscription** instead of polling for real-time agent marketplaces
- **Nonce-based PDA seeds** for same-slot collision resistance (current: timestamp-based)
- **Multi-token support** — USDC, SPL tokens via token program CPI

**Mid-term**
- **DAO-governed dispute arbitration** with staked arbiters
- **Agent staking** for reputation collateral — skin in the game
- **Rate limiting** on agent registration to prevent spam
- **Compute budget instructions** for complex multi-delegation workflows

**Long-term**
- **Cross-program composability** — third-party programs CPI into the protocol
- **Event indexing** via Helius/Triton for production-grade agent marketplaces

---

## Test Suite

60 tests covering:

- **Core instructions** — register, invoke, update, release, cancel, delegate, dispute, rate
- **Double-release attack** — Second release fails (status is Finalized)
- **Auto-release + manual release race** — Both orderings tested
- **Parent escrow drain** — Cannot delegate more than remaining escrow
- **Parent counter desync** — Child release without parent account fails
- **MAX_ACTIVE_CHILDREN** — 9th delegation fails (max 8)
- **Finalize-after-finalized guard** — Cannot finalize twice
- **Rent floor violation** — Delegation exceeding escrow + 1 fails
- **Event decoding** — All events decode correctly via Anchor EventParser
- **E2E flows** — Full human flow + full delegation flow with assertions

```
  60 passing (1m)
```

---

## Repo Structure

```
agent-protocol/          Anchor program (10 instructions, 60 tests)
  programs/agent-protocol/src/
    lib.rs
    state/               AgentProfile, Job, Rating
    instructions/        10 instruction handlers
    error.rs             18 error codes
    events.rs            9 event types
    constants.rs         DISPUTE_TIMEOUT, MAX_ACTIVE_CHILDREN
  tests/
    agent-protocol.ts    60 tests
blink-server/            Solana Actions server (Express.js)
  src/
    index.ts             CORS + routing
    routes/invoke.ts     GET (agent catalog) + POST (build tx)
    lib/program.ts       Anchor client
    lib/agents.ts        On-chain agent fetcher
agent-listener/          Agent simulator + live dashboard
  src/
    dashboard.ts         Real-time event dashboard
    demo.ts              13-step scripted demo
    index.ts             Live monitor mode
README.md
```

---

## License

MIT

---

*Built for the Solana Graveyard Hackathon 2026. Blinks were built for transactions — we made them agent-native.*
