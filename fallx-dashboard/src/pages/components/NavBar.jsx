import { signOut } from "aws-amplify/auth"

const COGNITO_DOMAIN = import.meta.env.VITE_COGNITO_DOMAIN
const COGNITO_CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID

export default function NavBar({ active = "dashboard" }) {
  const handleLogout = async () => {
    try {
      await signOut({ global: true })

      if (COGNITO_DOMAIN && COGNITO_CLIENT_ID) {
        const logoutRedirect = `${window.location.origin}/login`
        window.location.href =
          `${COGNITO_DOMAIN}/logout?client_id=${COGNITO_CLIENT_ID}&logout_uri=${encodeURIComponent(
            logoutRedirect
          )}`
        return
      }

      window.location.href = "/login"
    } catch (e) {
      console.error("Logout failed", e)
      window.location.href = "/login"
    }
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top">
      <div className="container-fluid px-3">
        <a className="navbar-brand fw-bold" href="/dashboard">
          FallX
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#fallxNavbar"
          aria-controls="fallxNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="fallxNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a
                className={`nav-link ${active === "dashboard" ? "active fw-bold" : ""}`}
                href="/dashboard"
              >
                Dashboard
              </a>
            </li>

            <li className="nav-item">
              <a
                className={`nav-link ${active === "devices" ? "active fw-bold" : ""}`}
                href="/manage-devices"
              >
                Manage Devices
              </a>
            </li>

            <li className="nav-item">
              <a
                className={`nav-link ${active === "residents" ? "active fw-bold" : ""}`}
                href="/manage-residents"
              >
                Manage Residents
              </a>
            </li>
          </ul>

          <button
            className="btn btn-outline-danger btn-sm"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
