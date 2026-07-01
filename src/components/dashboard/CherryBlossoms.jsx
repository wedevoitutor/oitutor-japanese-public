const PETALS = [
  { left: '5%', delay: '0s', duration: '12s' },
  { left: '25%', delay: '3s', duration: '15s' },
  { left: '65%', delay: '7s', duration: '13s' },
  { left: '85%', delay: '1s', duration: '16s' },
];

/** CSS-only cherry blossom petals drifting across the screen. */
export default function CherryBlossoms() {
  return PETALS.map((p, i) => (
    <span
      key={i}
      className="petal"
      style={{ left: p.left, animationDelay: p.delay, animationDuration: p.duration }}
    >
      🌸
    </span>
  ));
}
