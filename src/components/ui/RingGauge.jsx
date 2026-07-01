const DEFAULT_R = 20;

export default function RingGauge({
  pct,
  size = 48,
  stroke = 'white',
  track = 'rgba(255,255,255,0.2)',
  showLabel = true,
  fontSize = 10,
  strokeWidth = 3,
}) {
  const r = DEFAULT_R;
  const c = 2 * Math.PI * r;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <svg width={size} height={size} className="shrink-0 drop-shadow-sm">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={track} strokeWidth={strokeWidth} />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c - (pct / 100) * c}
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.34,1.56,0.64,1)' }}
      />
      {showLabel && (
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fill={stroke} fontSize={fontSize} fontWeight="700">
          {pct}%
        </text>
      )}
    </svg>
  );
}
