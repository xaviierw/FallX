import { useEffect, useState } from "react"
import KPIs from "./components/KPI.jsx"
import TrendChart from "./components/TrendChart.jsx"
import FallRecordsTable from "./components/FallRecordsTable.jsx"
import NavBar from "./components/NavBar.jsx"
import "./styles/kpi.css"
import "./styles/dashboard.css"
import { fetchAuthSession } from "aws-amplify/auth"

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:4000"

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loadingStats, setLoadingStats] = useState(true)
  const [error, setError] = useState("")

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

  return (
    <div className="dashboard-page">
      {/* ✅ Reusable Navbar */}
      <NavBar active="dashboard" />

      {/* CONTENT */}
      <main className="container-fluid px-3 py-3 dashboard-content">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h2 className="m-0 dashboard-title">FallX Dashboard</h2>
        </div>

        {loadingStats && <div className="text-muted">Loading KPIs...</div>}
        {error && <div className="alert alert-danger py-2 mb-3">{error}</div>}

        {!loadingStats && !error && stats && <KPIs stats={stats} />}
        {!loadingStats && !error && !stats && (
          <div className="alert alert-secondary py-2">
            No stats available yet.
          </div>
        )}

        <div className="dashboard-section mt-3">
          <TrendChart />
        </div>

        <div className="dashboard-section mt-3">
          <FallRecordsTable limit={20} />
        </div>
      </main>
    </div>
  )
}
