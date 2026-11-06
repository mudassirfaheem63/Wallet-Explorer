export default function StatsGrid({ balance, txCount, received, sent }) {
  return (
    <section className="stats">
      <article className="panel stat">
        <span>ETH balance</span>
        <strong>{balance ?? "—"}</strong>
        <small>USD value unavailable</small>
      </article>
      <article className="panel stat">
        <span>Normal transactions</span>
        <strong>{txCount ?? "—"}</strong>
        <small>Returned by API</small>
      </article>
      <article className="panel stat">
        <span>Total received</span>
        <strong>{received ?? "—"}</strong>
        <small>From normal transactions</small>
      </article>
      <article className="panel stat">
        <span>Total sent</span>
        <strong>{sent ?? "—"}</strong>
        <small>From normal transactions</small>
      </article>
    </section>
  );
}
