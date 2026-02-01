import { useEffect, useState } from "react"
import NavBar from "./components/NavBar.jsx"
import { fetchAuthSession } from "aws-amplify/auth"

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:4000"

export default function ManageDevices() {
  const [devices, setDevices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const handleBack = () => {
    window.history.back()
  }

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError("")

        const session = await fetchAuthSession()
        const token = session.tokens?.idToken?.toString()

        const res = await fetch(`${BACKEND_URL}/api/devices`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await res.json()

        if (!res.ok || !data?.success) {
          throw new Error(data?.message || "Server error")
        }

        setDevices(data.devices || [])
      } catch (e) {
        setError(e.message || "Server error")
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return (
    <>
      <NavBar active="devices" />

      <div className="container-fluid px-3 py-4">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h3 className="fw-bold m-0">Manage Devices</h3>

              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={handleBack}
              >
                ← Back
              </button>
            </div>

            <p className="text-muted mb-4">
              View, assign, and manage FallX devices linked to residents.
            </p>

            {error ? (
              <div className="alert alert-danger mb-4">{error}</div>
            ) : null}

            {loading ? (
              <div className="alert alert-info mb-4">Loading devices...</div>
            ) : (
              <div className="table-responsive mb-3">
                <table className="table table-sm align-middle">
                  <thead>
                    <tr>
                      <th>Device</th>
                      <th>Battery</th>
                      <th>Status</th>
                      <th>Last Seen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {devices.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-muted">
                          No devices found.
                        </td>
                      </tr>
                    ) : (
                      devices.map((d) => (
                        <tr key={d.deviceId}>
                          <td className="fw-semibold">{d.deviceId}</td>
                          <td>{d.battery}%</td>
                          <td>{d.status}</td>
                          <td>{d.lastSeen}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            <div className="d-flex gap-2">
              <button className="btn btn-primary" disabled>
                Add Device
              </button>
              <button className="btn btn-outline-secondary" disabled>
                Assign to Resident
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
