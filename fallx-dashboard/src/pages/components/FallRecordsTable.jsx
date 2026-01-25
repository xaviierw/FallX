import { useEffect, useMemo, useState } from "react"
import { fetchAuthSession } from "aws-amplify/auth"
import "../styles/fallRecords.css"

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:4000"

function toSGT(utcIso) {
  if (!utcIso || utcIso === "unknown") return "-"
  const d = new Date(utcIso)
  if (Number.isNaN(d.getTime())) return "-"

  return d.toLocaleString("en-SG", {
    timeZone: "Asia/Singapore",
    hour12: true,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function safeCsv(value) {
  const s = value === null || value === undefined ? "" : String(value)
  const escaped = s.replace(/"/g, '""')
  return `"${escaped}"`
}

export default function FallRecordsTable({ limit = 20 }) {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true)
        setError("")

        const session = await fetchAuthSession()
        const token = session.tokens?.idToken?.toString()

        if (!token) {
          throw new Error("No Cognito token found. Please login again.")
        }

        const res = await fetch(`${BACKEND_URL}/api/falls?limit=${limit}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        const data = await res.json()

        if (!res.ok || !data?.success) {
          throw new Error(data?.message || "Failed to load fall records")
        }

        setRecords(Array.isArray(data.records) ? data.records : [])
      } catch (e) {
        setError(e?.message || "Failed to load fall records")
      } finally {
        setLoading(false)
      }
    }

    fetchRecords()
  }, [limit])

  const rows = useMemo(() => {
    return (records || []).map((r) => {
      const deviceId = r.deviceId ?? r.device_id ?? "-"
      const residentName = r.residentName ?? r.resident_name ?? "Unknown"
      const timestampUtc = r.event_at_utc || r.timestamp_utc || r.timestamp
      const status = r.status || r.eventType || "Unknown"

      return {
        deviceId,
        residentName,
        timestampUtc,
        displayTime: toSGT(timestampUtc),
        status,
      }
    })
  }, [records])

  const exportCsv = () => {
    if (!rows.length) return

    const headers = ["device_id", "resident_name", "time_sgt", "status"]
    const dataRows = rows.map((r) => [
      safeCsv(r.deviceId),
      safeCsv(r.residentName),
      safeCsv(r.displayTime),
      safeCsv(r.status),
    ])

    const csv = [headers.join(","), ...dataRows.map((row) => row.join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "fall-records.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="fall-records">
      <div className="fall-records-header">
        <h3 className="fall-records-title">Fall Records</h3>

        <button
          className="fall-records-export"
          onClick={exportCsv}
          disabled={rows.length === 0}
        >
          Export as CSV
        </button>
      </div>

      {loading && <div className="fall-records-state">Loading fall records...</div>}
      {error && <div className="fall-records-state">{error}</div>}

      {!loading && !error && (
        <div className="fall-records-table-wrap">
          <table className="fall-records-table">
            <thead>
              <tr>
                <th>Device ID</th>
                <th>Resident</th>
                <th>Time (SGT)</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: 16 }}>
                    No fall record yet
                  </td>
                </tr>
              )}

              {rows.map((r, i) => (
                <tr key={i}>
                  <td className="mono">{r.deviceId}</td>
                  <td>{r.residentName}</td>
                  <td>{r.displayTime}</td>
                  <td>
                    <span className={`badge sent`}>
                      {r.status}
                    </span>
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
