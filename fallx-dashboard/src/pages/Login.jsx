import { signInWithRedirect } from "aws-amplify/auth"
import "./styles/home.css"

export default function Home() {
  return (
    <div className="home-page d-flex align-items-center justify-content-center">
      <div className="card shadow-sm home-card">
        <div className="card-body text-center p-4">
          <h1 className="mb-2 fw-bold">FallX</h1>
          <p className="text-muted mb-4">
            Smart fall detection & monitoring for safer independent living
          </p>

          <button
            className="btn btn-primary btn-lg w-100"
            onClick={() =>
              signInWithRedirect({
                options: { prompt: "login" },
              })
            }
          >
            Sign in with Caregiver Account
          </button>

          <div className="mt-3 text-muted small">
            Secure login powered by AWS Cognito
          </div>
        </div>
      </div>
    </div>
  )
}
