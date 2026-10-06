# AgriTrace

**Farm-to-Market Traceability and Transparent Price Discovery System**

AgriTrace is a development/testnet full-stack blockchain dApp for agricultural supply-chain transparency. It separates trust-sensitive data from application data:

- **On-chain:** lot ID, crop, origin, harvest timestamp, metadata hash, verification status, price snapshots, and selected sensor observations.
- **Off-chain:** richer metadata, application IDs, operational sensor streams, analytics, and large documents/files.

> This project is a testnet implementation. It is not presented as production-secure or production-ready.

## 1. Features

- MetaMask connection with Sepolia network detection/switching
- Real Solidity smart contract for agricultural lot anchors
- On-chain produce verification
- On-chain price history
- On-chain cold-chain/sensor anchors
- PostgreSQL REST API for off-chain records
- Hash linkage between richer off-chain metadata and immutable blockchain records
- Responsive Web3-style frontend built with HTML5/CSS3/Vanilla JS
- User-friendly wallet/API/transaction error handling

## 2. Architecture

```text
                     BLOCKCHAIN PATH
User
  ↓
HTML5 + CSS3 + Vanilla JS
  ↓
frontend/js/blockchain.js
  ↓
Ethers.js
  ↓
MetaMask
  ↓
AgriTrace.sol
  ↓
Ethereum-compatible blockchain (Sepolia)

                    OFF-CHAIN PATH
Frontend JS
  ↓
Express REST API
  ↓
PostgreSQL
```

## 3. Technologies

- Frontend: HTML5, CSS3, Vanilla JavaScript
- Blockchain: Solidity 0.8.24, Hardhat, Ethers.js 6.x, MetaMask
- Network: Sepolia testnet
- Backend: Node.js, Express.js, Helmet, CORS
- Database: PostgreSQL

## 4. Folder structure

```text
AgriTrace/
├── frontend/
│   ├── index.html
│   ├── css/style.css
│   ├── js/app.js
│   ├── js/wallet.js
│   ├── js/blockchain.js
│   └── assets/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── config/
│   │   ├── env.js
│   │   └── db.js
│   ├── routes/
│   │   ├── recordRoutes.js
│   │   ├── healthRoutes.js
│   │   ├── priceRoutes.js
│   │   ├── sensorRoutes.js
│   │   └── traceabilityRoutes.js
│   ├── controllers/
│   │   ├── recordController.js
│   │   ├── priceController.js
│   │   ├── sensorController.js
│   │   └── traceabilityController.js
│   ├── models/
│   │   ├── recordModel.js
│   │   ├── priceModel.js
│   │   └── sensorModel.js
│   └── middleware/validate.js
├── blockchain/
│   ├── contracts/AgriTrace.sol
│   ├── scripts/deploy.js
│   ├── test/AgriTrace.test.js
│   ├── hardhat.config.js
│   └── package.json
├── database/
│   ├── schema.sql
│   └── seed.sql
├── .env.example
├── .gitignore
└── README.md
```

## 5. Prerequisites

Install:

- Node.js 20+ recommended
- npm
- PostgreSQL 14+
- MetaMask browser extension
- A Sepolia-compatible wallet with Sepolia ETH
- A Sepolia RPC endpoint for deployment (Infura, Alchemy, or another provider)

## 6. PostgreSQL setup

Create the database:

```bash
createdb agritrace
```

Apply schema:

```bash
psql -d agritrace -f database/schema.sql
```

Optional demo data:

```bash
psql -d agritrace -f database/seed.sql
```

Set your backend connection string in `.env`:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/agritrace
```

## 7. Backend setup

From the project root:

```bash
cd backend
npm install
npm start
```

The API runs at:

```text
http://localhost:4000
```

Health check:

```text
GET http://localhost:4000/api/health
```

Useful REST endpoints:

```text
// Produce Records & Batches
GET    /api/records
GET    /api/records/:id
POST   /api/records
PUT    /api/records/:id
DELETE /api/records/:id
GET    /api/batches

// Price Discovery
GET    /api/prices/:batchId
POST   /api/prices

// IoT Environmental & Cold-Chain Monitoring
GET    /api/environment/:batchId
POST   /api/environment

// Comprehensive Lifecycle Traceability
GET    /api/traceability/:batchId
```

The backend never pretends to be the blockchain. It stores application metadata and links to real on-chain transaction hashes.

## 8. MetaMask / Sepolia setup

1. Install MetaMask.
2. Create/use a dedicated development wallet.
3. Switch to the Sepolia network.
4. Obtain Sepolia ETH from a reputable Sepolia faucet.
5. Never put the seed phrase or wallet password into this application.

The frontend can request a switch to Sepolia after the wallet connects.

## 9. Configure deployment environment

Copy:

```bash
cp .env.example .env
```

Fill the deployment values:

```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
DEPLOYER_PRIVATE_KEY=0xYOUR_TESTNET_PRIVATE_KEY
```

**Security rule:** this private key belongs only in your local deployment `.env`. Never publish it, commit it, or paste it into frontend code.

## 10. Compile Solidity

From the blockchain folder:

```bash
cd blockchain
npm install
npm run compile
```

## 11. Run smart-contract tests

```bash
npm test
```

The expanded test suite (19 passing test cases) verifies:

1. **Access Control & Operators:**
   - Owner initialization & operator role assignment
   - Role granting and revocation with event emissions
   - Unauthorized access rejection & zero-address prevention
2. **Produce Record Creation & Retrieval:**
   - Accurate produce lot anchor creation & retrieval
   - Unauthorized caller restriction
   - Duplicate lot ID rejection
   - Empty/invalid field validation
   - Non-existent lot query revert
3. **Record Verification Lifecycle:**
   - Authorized operator verification transition
   - Double-verification rejection
   - Unauthorized verification rejection
4. **Price Discovery:**
   - Multi-tier price recording (Farmer -> Aggregator -> Retail)
   - Progression sanity validation (rejects farmer/aggregator > retail)
   - Non-existent lot rejection
5. **Sensor & Cold-Chain Monitoring:**
   - Temperature & humidity telemetry storage
   - Negative temperature handling for cold storage/freezers
   - Out-of-bounds telemetry validation
   - Non-existent lot rejection

## 12. Deploy to Sepolia

From `blockchain/`:

```bash
npm run deploy:sepolia
```

The deploy script prints the real deployed contract address, chain ID, and stores deployment metadata under:

```text
blockchain/deployments/11155111.json
```

## 13. Obtain the contract address

Read the address from the deployment command output or the generated JSON file:

```text
blockchain/deployments/11155111.json
```

It will look like:

```json
{
  "contractName": "AgriTrace",
  "address": "0x...real deployed address...",
  "chainId": "11155111"
}
```

Do not invent an address. The frontend must use the address from your deployment.

## 14. Obtain the ABI

Hardhat creates the compiled artifact at:

```text
blockchain/artifacts/contracts/AgriTrace.sol/AgriTrace.json
```

Its `abi` field is the contract ABI. This project already includes a beginner-readable ABI in:

```text
frontend/js/blockchain.js
```

The browser only needs the methods it calls, so the embedded ABI is intentionally minimal.

## 15. Put the contract address into the frontend

Open:

```text
frontend/js/blockchain.js
```

Replace:

```js
CONTRACT_ADDRESS: "0x0000000000000000000000000000000000000000"
```

with your actual Sepolia contract address.

For read-only RPC calls you may also set:

```js
SEPOLIA_RPC_URL: "https://rpc.sepolia.org"
```

A public RPC endpoint is not a private key. Do not put deployment secrets in this file.

## 16. Run the frontend

The simplest option is a static HTTP server.

From `frontend/`:

```bash
cd frontend
python -m http.server 5500
```

Open:

```text
http://localhost:5500
```

Keep the Express backend running separately on port 4000.

## 17. End-to-end demo flow

1. Start PostgreSQL.
2. Run `database/schema.sql` and optionally `database/seed.sql`.
3. Start the backend with `npm start` in `backend/`.
4. Compile/test/deploy the contract from `blockchain/`.
5. Copy the real Sepolia contract address into `frontend/js/blockchain.js`.
6. Start the frontend with `python -m http.server 5500`.
7. Open the website and connect MetaMask.
8. Ensure MetaMask is on Sepolia.
9. Create a lot such as `AGR-2026-0004`.
10. The frontend creates the PostgreSQL record first, then prompts MetaMask to sign `createProduceRecord`.
11. Wait for a real Sepolia confirmation.
12. The frontend writes the real transaction hash and on-chain key back to PostgreSQL.

The important integrity link is:

```text
PostgreSQL metadata
      │
      └── metadataHash ─────────┐
                                ↓
                         Solidity record
                                ↓
                      Sepolia transaction
```

## 18. How the files communicate

### Frontend

- `frontend/index.html` defines the UI and loads Ethers.js plus the three frontend scripts.
- `frontend/js/app.js` handles forms, REST API calls, dashboard rendering, and user messages.
- `frontend/js/wallet.js` handles MetaMask accounts, chain detection, and network switching.
- `frontend/js/blockchain.js` handles Ethers.js providers, contract instances, ABI, reads, writes, and transaction confirmations.
- `frontend/css/style.css` contains all visual styling and responsive rules.

### Backend

- `backend/server.js` starts Express, security middleware, CORS, routes, and error handling.
- `backend/routes/recordRoutes.js` exposes the produce-record REST endpoints.
- `backend/controllers/recordController.js` validates requests and calls the data model.
- `backend/models/recordModel.js` runs parameterized PostgreSQL queries.
- `backend/config/db.js` owns the PostgreSQL connection pool.
- `backend/config/env.js` reads environment variables.
- `backend/middleware/validate.js` provides reusable field validation.

### Blockchain

- `blockchain/contracts/AgriTrace.sol` is the source of truth for immutable blockchain data.
- `blockchain/scripts/deploy.js` deploys the contract and writes deployment metadata.
- `blockchain/hardhat.config.js` configures compilation and Sepolia deployment.
- `blockchain/test/AgriTrace.test.js` checks the real contract behavior.

## 19. Common errors and solutions

### MetaMask not installed

Install MetaMask and refresh the frontend.

### Wallet rejected

The user cancelled the MetaMask request. Try the transaction again.

### Wrong network

Use the frontend network switch action or switch MetaMask manually to Sepolia.

### Contract not configured

Set the deployed Sepolia address in `frontend/js/blockchain.js`.

### Transaction says insufficient funds

The wallet needs Sepolia ETH for gas. Do not use a real-money wallet for testing.

### Backend unavailable

Run:

```bash
cd backend
npm start
```

Then verify:

```text
http://localhost:4000/api/health
```

### Database unavailable

Check PostgreSQL is running and verify `DATABASE_URL` in `.env`.

### Ethers.js failed to load

The frontend currently loads Ethers.js from jsDelivr. Check internet access or replace the CDN reference with a locally hosted Ethers.js build.

### Deployment fails

Check `SEPOLIA_RPC_URL`, `DEPLOYER_PRIVATE_KEY`, Sepolia ETH balance, and wallet/network configuration. Never expose the private key while troubleshooting.

## 20. Hardware / IoT Integration (ESP32, DHT22, GPS)

AgriTrace includes native IoT integration hooks for field and transit monitoring:

### HTTP Ingestion Endpoint
Hardware devices such as an **ESP32**, **Raspberry Pi Pico W**, or **cellular IoT tracker** can stream environmental telemetry directly via HTTP POST:

```http
POST /api/environment HTTP/1.1
Host: localhost:4000
Content-Type: application/json
X-Device-Id: ESP32-COLDCHAIN-TRUCK-01

{
  "lotId": "AGR-2026-0001",
  "temperatureC": 4.2,
  "humidityPct": 88.5,
  "locationLat": 28.6139,
  "locationLng": 77.2090,
  "notes": "Refrigerated transit - automated telemetry"
}
```

### Direct On-Chain Anchoring
For critical audit checkpoints (e.g. handover between farmer, cold-storage, and distributor), telemetry can also be anchored directly on-chain using:

```solidity
function recordSensorData(
    string calldata _lotId,
    int256 _temperature,   // e.g. 4 for 4°C, -18 for freezer
    uint256 _humidity,     // e.g. 88 for 88%
    uint256 _timestamp,
    string calldata _location
) external onlyOperator;
```

## 21. Trust boundary summary

```text
IMMUTABLE / TRUST-SENSITIVE
- Lot ID
- Crop name
- Origin
- Harvest timestamp
- Metadata hash
- Verification status
- Price snapshots
- Selected sensor observations

OFF-CHAIN / FLEXIBLE
- PostgreSQL UUIDs
- Rich metadata
- Sensor stream history at scale
- Analytics
- Large files/documents
- Dashboard state
```

This split keeps blockchain gas usage lower while preserving a cryptographic audit anchor for important claims.
