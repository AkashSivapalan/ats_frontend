function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n))
}

export function Stars({ score }) {
  const filled = clamp(Math.round(Number(score) || 0), 0, 5)

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div aria-label={`${filled} out of 5`} style={{ display: 'flex', gap: 4 }}>
        {Array.from({ length: 5 }).map((_, i) => {
          const isOn = i < filled
          return (
            <span
              key={i}
              aria-hidden="true"
              style={{
                width: 18,
                height: 18,
                display: 'inline-grid',
                placeItems: 'center',
                color: isOn ? '#e6a800' : 'rgba(0,0,0,0.25)',
                filter: isOn ? 'drop-shadow(0 0 12px rgba(251,191,36,0.18))' : 'none',
              }}
            >
              ★
            </span>
          )
        })}
      </div>
      <span className="badge">{filled}/5</span>
    </div>
  )
}

