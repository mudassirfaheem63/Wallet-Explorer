export default function SearchPanel({ value, onChange, onSubmit, loading, message }) {
  const handleKeyDown = (event) => {
    if (event.key === "Enter") onSubmit();
  };

  return (
    <section className="search panel">
      <label htmlFor="walletAddress">Wallet address</label>
      <div className="search-row">
        <input
          id="walletAddress"
          type="text"
          spellCheck={false}
          placeholder="0x..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button id="searchBtn" onClick={onSubmit} disabled={loading}>
          Explore wallet
        </button>
      </div>
      <p id="message" role="status">{message}</p>
    </section>
  );
}
