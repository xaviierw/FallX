import NavBar from "./components/NavBar.jsx"

export default function ManageResidents() {
  const handleBack = () => {
    window.history.back()
  }

  return (
    <>
      <NavBar active="residents" />

      <div className="container-fluid px-3 py-4">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h3 className="fw-bold m-0">Manage Residents</h3>

              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={handleBack}
              >
                ← Back
              </button>
            </div>

            <p className="text-muted mb-4">
              Add and manage residents under your care.
            </p>

            <div className="alert alert-info mb-4">
              Resident management features are coming soon.
            </div>

            <div className="d-flex gap-2">
              <button className="btn btn-primary" disabled>
                Add Resident
              </button>
              <button className="btn btn-outline-secondary" disabled>
                Edit Resident
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
