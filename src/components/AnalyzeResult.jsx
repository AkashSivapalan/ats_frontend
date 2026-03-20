import { Stars } from './Stars.jsx'

function Section({ title, items, emptyText }) {
  const list = Array.isArray(items) ? items : []
  return (
    <section style={{ display: 'grid', gap: 10 }}>
      <div className="labelRow">
        <div className="label">{title}</div>
      </div>

      {list.length ? (
        <ul style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 6 }}>
          {list.map((x, idx) => (
            <li key={`${title}-${idx}`}>
              {x}
            </li>
          ))}
        </ul>
      ) : (
        <div className="hint">{emptyText}</div>
      )}
    </section>
  )
}

export function AnalyzeResult({ result }) {
  if (!result) return null

  return (
    <div className="panel" style={{ display: 'grid', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <h2 className="panelTitle" style={{ margin: 0 }}>
          ATS Match
        </h2>
        <Stars score={result.score} />
      </div>

      <div className="hr" />

      <div style={{ display: 'grid', gap: 18 }}>
        <Section
          title="Matching skills"
          items={result.matchingSkills}
          emptyText="No matching skills returned."
        />
        <Section
          title="Missing skills"
          items={result.missingSkills}
          emptyText="No missing skills returned."
        />
        <Section
          title="Suggestions"
          items={result.suggestions}
          emptyText="No suggestions returned."
        />
      </div>
    </div>
  )
}

