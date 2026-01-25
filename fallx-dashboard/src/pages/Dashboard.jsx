import { useEffect, useState } from "react"
import KPIs from "./components/KPI.jsx"
import TrendChart from "./components/TrendChart.jsx"
import FallRecordsTable from "./components/FallRecordsTable.jsx"
import "./styles/kpi.css"
import "./styles/fallRecords.css"
import { fetchAuthSession, signOut } from "aws-amplify/auth"

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:4000"

// For Hosted UI logout (clears the Cognito browser session cookie)
const COGNITO_DOMAIN = import.meta.env.VITE_COGNITO_DOMAIN // e.g. https://your-domain.auth.ap-southeast-1.amazoncognito.com
const COGNITO_CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loadingStats, setLoadingStats] = useState(true)
  const [error, setError] = useState("")

  const [records, setRecords] = useState([])
  const [loadingRecords, setLoadingRecords] = useState(true)
  const [recordsError, setRecordsError] = useState("")

  const handleLogout = async () => {
    try {
      // Clears Amplify local session + invalidates tokens
      await signOut({ global: true })

      // Also clear Hosted UI session cookie (prevents instant re-login)
      if (COGNITO_DOMAIN && COGNITO_CLIENT_ID) {
        const logoutRedirect = `${window.location.origin}/login`
        window.location.href =
          `${COGNITO_DOMAIN}/logout?client_id=${COGNITO_CLIENT_ID}&logout_uri=${encodeURIComponent(logoutRedirect)}`
        return
      }

      // Fallback if you are not using Hosted UI
      window.location.href = "/login"
    } catch (e) {
      console.error("Logout failed", e)
      window.location.href = "/login"
    }
  }

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoadingStats(true)
        setError("")

        const session = await fetchAuthSession()
        const token = session.tokens?.idToken?.toString()

        if (!token) {
          throw new Error("No Cognito token found. Please login again.")
        }

        const res = await fetch(`${BACKEND_URL}/api/stats/summary`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        const data = await res.json()

        if (!res.ok || !data?.success) {
          throw new Error(data?.message || "Failed to load dashboard stats")
        }

        setStats(data.summary)
      } catch (e) {
        setError(e?.message || "Something went wrong")
      } finally {
        setLoadingStats(false)
      }
    }

    fetchSummary()
  }, [])

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoadingRecords(true)
        setRecordsError("")

        const session = await fetchAuthSession()
        const token = session.tokens?.idToken?.toString()

        if (!token) {
          throw new Error("No Cognito token found. Please login again.")
        }

        const res = await fetch(`${BACKEND_URL}/api/falls?limit=20`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        const data = await res.json()

        if (!res.ok || !data?.success) {
          throw new Error(data?.message || "Failed to load fall records")
        }

        setRecords(Array.isArray(data.records) ? data.records : [])
      } catch (e) {
        setRecordsError(e?.message || "Failed to load fall records")
      } finally {
        setLoadingRecords(false)
      }
    }

    fetchRecords()
  }, [])

  const exportCsv = () => {
    if (!records || records.length === 0) return

    const headers = ["device_id", "resident_name", "timestamp", "status", "severity"]
    const rows = records.map((r) => [
      safeCsv(r.device_id),
      safeCsv(r.resident_name),
      safeCsv(r.timestamp),
      safeCsv(r.status),
      safeCsv(r.severity),
    ])

    const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "fall-records.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2 className="dashboard-title">FallX Dashboard</h2>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {loadingStats && <div>Loading KPIs...</div>}
      {error && <div className="error">{error}</div>}

      {!loadingStats && !error && stats && <KPIs stats={stats} />}
      {!loadingStats && !error && !stats && <div>No stats available yet.</div>}

      <TrendChart />

      <FallRecordsTable
        records={records}
        loading={loadingRecords}
        error={recordsError}
        onExportCsv={exportCsv}
      />
    </div>
  )
}

function safeCsv(value) {
  const s = value === null || value === undefined ? "" : String(value)
  const escaped = s.replace(/"/g, '""')
  return `"${escaped}"`
}
