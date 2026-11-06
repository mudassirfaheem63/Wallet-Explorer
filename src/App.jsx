import { useRef, useState } from "react";
import SearchPanel from "./components/SearchPanel.jsx";
import StatsGrid from "./components/StatsGrid.jsx";
import TransactionTable from "./components/TransactionTable.jsx";
import { loadWallet } from "./api/blockscout.js";
import { DEFAULT_ADDRESS, EXPLORER, TX_LIMIT } from "./config.js";
import { formatEth, isAddress } from "./utils/format.js";

export default function App() {
  const [input, setInput] = useState(DEFAULT_ADDRESS);
  const [message, setMessage] = useState("");
  // status: "idle" | "loading" | "ready" | "error"
  const [status, setStatus] = useState("idle");
  const [wallet, setWallet] = useState(null);

  // Tracks the latest request so a slow earlier response can't overwrite newer results.
  const requestId = useRef(0);
  const controllerRef = useRef(null);

  const explore = async () => {
    const address = input.trim();

    if (!isAddress(address)) {
      setMessage("Please enter a valid 0x Ethereum address (40 hex characters).");
      return;
    }

    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    const id = ++requestId.current;

    setStatus("loading");
    setMessage("Fetching wallet data from Sepolia…");

    try {
      const data = await loadWallet(address, controller.signal);
      if (id !== requestId.current) return;

      setWallet(data);
      setStatus("ready");
      setMessage(`Loaded ${data.txCount} transactions.`);
    } catch (err) {
      if (err.name === "AbortError" || id !== requestId.current) return;
      setWallet(null);
      setStatus("error");
      setMessage(`Could not load wallet: ${err.message}`);
    }
  };

  const loaded = status === "ready" && wallet;
  const viewAddress = loaded ? wallet.address : DEFAULT_ADDRESS;

  return (
    <>
      <header className="header">
        <div>
          <p className="eyebrow">ETHEREUM SEPOLIA TESTNET · CHAIN ID 11155111</p>
          <h1>Wallet Explorer</h1>
          <p className="subtitle">Explore public Sepolia wallet activity.</p>
        </div>
        <a className="external" href={EXPLORER} target="_blank" rel="noopener noreferrer">
          Blockscout ↗
        </a>
      </header>

      <main>
        <SearchPanel
          value={input}
          onChange={setInput}
          onSubmit={explore}
          loading={status === "loading"}
          message={message}
        />

        <StatsGrid
          balance={loaded ? `${formatEth(wallet.balance)} ETH` : null}
          txCount={loaded ? wallet.txCount.toLocaleString() : null}
          received={loaded ? `${wallet.totalReceived.toFixed(6)} ETH` : null}
          sent={loaded ? `${wallet.totalSent.toFixed(6)} ETH` : null}
        />

        <section className="panel">
          <div className="section-head">
            <div>
              <h2>Recent transactions</h2>
              <p>Latest 10 transactions</p>
            </div>
            <a
              href={`${EXPLORER}/address/${viewAddress}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View on Blockscout ↗
            </a>
          </div>
          <TransactionTable
            status={status}
            transactions={loaded ? wallet.transactions : null}
            wallet={loaded ? wallet.wallet : null}
          />
        </section>

        <section className="panel note">
          <h2>What this app can and cannot show</h2>
          <p>
            Ethereum addresses are public, pseudonymous identifiers. This app displays public
            on-chain data only; it cannot reveal a person's real identity, private keys,
            passwords, or off-chain information. “Total sent/received” here sums transaction
            values only from the latest {TX_LIMIT} transactions, not every token, internal
            transfer, or NFT movement.
          </p>
        </section>
      </main>

      <footer>Wallet Explorer · Read-only Sepolia testnet lookup</footer>
    </>
  );
}
