export default function FallRecordsTable({ records, loading, error, onExportCsv }) {
  return (
    <div className="fall-records">
      <div className="fall-records-header">
        <h3 className="fall-records-title">Fall Records</h3>

        <div className="fall-records-actions">
          <button
            type="button"
            className="fall-records-export"
            onClick={onExportCsv}
            disabled={!records || records.length === 0}
          >
            Export as CSV
          </button>
        </div>
      </div>

      {loading && <div className="fall-records-state">Loading records...</div>}
      {error && <div className="fall-records-state error">{error}</div>}

      {!loading && !error && (!records || records.length === 0) && (
        <div className="fall-records-state">No fall records yet.</div>
      )}

      {!loading && !error && records && records.length > 0 && (
        <div className="fall-records-table-wrap">
          <table className="fall-records-table">
            <thead>
              <tr>
                <th>Device ID</th>
                <th>Resident</th>
                <th>Timestamp</th>
                <th>Status</th>
                <th>Severity</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {records.map((r) => (
                <tr key={r.fall_id || r.id || `${r.device_id}-${r.timestamp}`}>
                  <td className="mono">{r.device_id ?? "—"}</td>
                  <td className="strong">{r.resident_name ?? "—"}</td>
                  <td className="mono">{r.timestamp_display ?? r.timestamp ?? "—"}</td>

                  <td>
                    <span className={`badge status ${badgeKey(r.status)}`}>
                      {r.status ?? "—"}
                    </span>
                  </td>

                  <td>
                    <span className={`badge severity ${badgeKey(r.severity)}`}>
                      {r.severity ?? "—"}
                    </span>
                  </td>

                  <td>
                    <button type="button" className="link-btn" onClick={() => r.onDelete?.(r)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function badgeKey(value) {
  if (!value) return "muted"
  const v = String(value).toLowerCase().trim()

  if (v.includes("high")) return "high"
  if (v.includes("medium")) return "medium"
  if (v.includes("low")) return "low"

  if (v.includes("sent")) return "sent"
  if (v.includes("resolved")) return "resolved"
  if (v.includes("pending")) return "pending"

  return "muted"
}
