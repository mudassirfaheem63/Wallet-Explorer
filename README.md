# Wallet Explorer (React · Sepolia)

A read-only Ethereum Sepolia testnet wallet explorer built with React, Vite and the Blockscout API.
No API key is required.

## Setup

```bash
npm install
npm run dev
```

Open the printed local URL, paste a Sepolia address, and click **Explore wallet** (or press Enter).

## Scripts

- `npm run dev` – start the dev server
- `npm run build` – create a production build in `dist/`
- `npm run preview` – preview the production build

## Project structure

```
src/
├── main.jsx                  # React entry point
├── App.jsx                   # Top-level state and layout
├── config.js                 # Blockscout API URL, explorer URL, limits
├── styles.css                # Dark theme styles
├── api/blockscout.js         # Blockscout requests and totals calculation
├── utils/format.js           # Address validation, ETH/date formatting
└── components/
    ├── SearchPanel.jsx       # Address input and status message
    ├── StatsGrid.jsx         # Balance, count, received, sent cards
    └── TransactionTable.jsx  # Recent transactions table
```

## Features

- ETH balance (Sepolia)
- Transaction count (up to 50 in this starter)
- Received/sent totals from the returned transactions
- Latest 10 transactions with explorer links
- Responsive dark UI
- Address validation and error states
- Stale-response protection: a slower earlier request cannot overwrite newer results

## Limitations

- Totals come only from the latest transactions returned, not lifetime totals.
- Token transfers, internal transactions, and NFTs are not included.
- USD price and charts are not implemented.
- This is a testnet explorer. Sepolia ETH has no real-world value.
