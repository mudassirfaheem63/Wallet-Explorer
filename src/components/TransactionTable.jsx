import { EXPLORER, RECENT_COUNT } from "../config.js";
import { formatDate, formatEth, shortAddress } from "../utils/format.js";

function Placeholder({ text }) {
  return (
    <tr>
      <td colSpan={6} className="empty">{text}</td>
    </tr>
  );
}

export default function TransactionTable({ status, transactions, wallet }) {
  let body;

  if (status === "loading") {
    body = <Placeholder text="Loading…" />;
  } else if (status === "error") {
    body = <Placeholder text="Unable to load transactions." />;
  } else if (!transactions) {
    body = <Placeholder text="Enter a wallet address to load transactions." />;
  } else if (transactions.length === 0) {
    body = <Placeholder text="No normal transactions returned." />;
  } else {
    body = transactions.slice(0, RECENT_COUNT).map((tx) => {
      const incoming = (tx.to || "").toLowerCase() === wallet;
      const failed = tx.isError === "1";
      const counterparty = incoming ? tx.from : tx.to;

      return (
        <tr key={tx.hash}>
          <td>
            <a
              href={`${EXPLORER}/tx/${encodeURIComponent(tx.hash)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {shortAddress(tx.hash)}
            </a>
          </td>
          <td className={`direction ${incoming ? "in" : "out"}`}>
            {incoming ? "↓ Received" : "↑ Sent"}
          </td>
          <td>
            {counterparty ? (
              <a
                href={`${EXPLORER}/address/${encodeURIComponent(counterparty)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {shortAddress(counterparty)}
              </a>
            ) : (
              "Contract creation"
            )}
          </td>
          <td>{`${formatEth(tx.value)} ETH`}</td>
          <td className={`status ${failed ? "failed" : ""}`}>
            {failed ? "Failed" : "Success"}
          </td>
          <td>{formatDate(tx.timeStamp)}</td>
        </tr>
      );
    });
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Transaction</th>
            <th>Direction</th>
            <th>Counterparty</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>{body}</tbody>
      </table>
    </div>
  );
}
