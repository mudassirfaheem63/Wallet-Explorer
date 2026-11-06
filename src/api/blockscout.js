import { API_BASE, TX_LIMIT } from "../config.js";

async function getJson(path) {
  const response = await fetch(`${API_BASE}${path}`);
  if (response.status === 404) throw new Error("Address not found on Sepolia");
  if (!response.ok) throw new Error(`HTTP error ${response.status}`);
  return response.json();
}

// Normalize Blockscout's transaction shape so the UI code stays simple.
function normalizeTx(tx) {
  return {
    hash: tx.hash,
    from: tx.from?.hash ?? null,
    to: tx.to?.hash ?? null,
    value: tx.value ?? "0",
    isError: tx.status === "ok" ? "0" : "1",
    timeStamp: String(Math.floor(Date.parse(tx.timestamp) / 1000)),
  };
}

export async function loadWallet(address) {
  const [info, txData] = await Promise.all([
    getJson(`/addresses/${address}`),
    getJson(`/addresses/${address}/transactions`),
  ]);

  const list = (txData.items || []).slice(0, TX_LIMIT).map(normalizeTx);
  const wallet = address.toLowerCase();

  let totalReceived = 0;
  let totalSent = 0;
  for (const tx of list) {
    const value = Number(tx.value) / 1e18;
    if ((tx.to || "").toLowerCase() === wallet) totalReceived += value;
    if ((tx.from || "").toLowerCase() === wallet) totalSent += value;
  }

  return {
    address,
    wallet,
    balance: info.coin_balance ?? "0",
    transactions: list,
    txCount: list.length,
    totalReceived,
    totalSent,
  };
}