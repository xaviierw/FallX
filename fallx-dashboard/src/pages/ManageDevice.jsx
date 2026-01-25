import NavBar from "./components/NavBar.jsx"

export default function ManageDevices() {
  const handleBack = () => {
    window.history.back()
  }

  return (
    <>
      {/* Top Navigation */}
      <NavBar active="devices" />

      <div className="container-fluid px-3 py-4">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            {/* Header row */}
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

            <div className="alert alert-info mb-4">
              Device management features are coming soon.
            </div>

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
