import { useEffect, useState } from "react"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend, } from "chart.js"
import { Bar } from "react-chartjs-2"
import "../styles/fallsByResident.css"
import { fetchAuthSession } from "aws-amplify/auth"

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:4000"

export default function FallsByResidentChart() {
  const [rows, setRows] = useState([])
  const [meta, setMeta] = useState({
    residentsWithFalls: 0,
    totalResidents: 0,
    days: 7,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchFallsByResident = async () => {
      try {
        setLoading(true)
        setError("")

        const session = await fetchAuthSession()
        const token = session.tokens?.idToken?.toString()

        const headers = {}
        if (token) headers.Authorization = `Bearer ${token}`

        const days = 7
        const res = await fetch(`${BACKEND_URL}/api/stats/falls-by-resident?days=${days}`, {
          headers,
        })

        const data = await res.json()

        if (!res.ok || !data?.success) {
          throw new Error(data?.message || "Failed to load falls-by-resident data")
        }

        setRows(data.data || [])
        setMeta({
          residentsWithFalls: data.residentsWithFalls || 0,
          totalResidents: data.totalResidents || 0,
          days: data.days || days,
        })
      } catch (e) {
        setError(e.message || "Something went wrong")
      } finally {
        setLoading(false)
      }
    }

    fetchFallsByResident()
  }, [])

  if (loading) return <div>Loading falls by resident...</div>
  if (error) return <div className="error">{error}</div>

  const labels = rows.map((x) => x.residentName || x.name || x.residentId)
  const values = rows.map((x) => x.count || 0)

  const chartData = {
    labels,
    datasets: [
      {
        label: "Falls",
        data: values,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0 },
      },
    },
  }

  return (
    <div className="fbr-card">
      <div className="fbr-title">Falls by Resident (Last {meta.days} Days)</div>

      <div className="fbr-subtitle">
        Residents with falls: <b>{meta.residentsWithFalls}</b> / {meta.totalResidents}
      </div>

      <div className="fbr-chart-wrapper">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  )
}
