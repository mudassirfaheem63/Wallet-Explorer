export const isAddress = (address) => /^0x[a-fA-F0-9]{40}$/.test(address);

export const shortAddress = (address) =>
  `${address.slice(0, 6)}…${address.slice(-4)}`;

export const formatEth = (wei) =>
  (Number(wei) / 1e18).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 6,
  });

export const formatDate = (timestamp) =>
  new Date(Number(timestamp) * 1000).toLocaleString();
