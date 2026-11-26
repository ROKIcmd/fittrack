// Placeholder QR code (not scannable). Pattern is seeded, so each plan gets its own.
export default function SampleQr({ seed = "fittrack", className = "" }) {
  const N = 25;
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const rnd = () => ((h = (h * 1664525 + 1013904223) >>> 0) / 2 ** 32);
  const inFinder = (x, y) => (x < 8 && y < 8) || (x >= N - 8 && y < 8) || (x < 8 && y >= N - 8);
  const cells = [];
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (!inFinder(x, y) && rnd() > 0.5) cells.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />);
  const finder = (x, y) => (
    <g key={`${x}${y}`}>
      <rect x={x} y={y} width="7" height="7" />
      <rect x={x + 1} y={y + 1} width="5" height="5" fill="#fff" />
      <rect x={x + 2} y={y + 2} width="3" height="3" />
    </g>
  );
  return (
    <svg viewBox={`-1 -1 ${N + 2} ${N + 2}`} className={className} role="img" aria-label="Sample payment QR code">
      <rect x="-1" y="-1" width={N + 2} height={N + 2} fill="#fff" />
      {cells}
      {finder(0, 0)}{finder(N - 7, 0)}{finder(0, N - 7)}
    </svg>
  );
}
