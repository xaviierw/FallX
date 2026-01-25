import { signInWithRedirect } from "aws-amplify/auth";

export default function Home() {
  return (
    <div style={{ padding: 24 }}>
      <h1>FallX Dashboard</h1>
      <button
        onClick={() =>
          signInWithRedirect({
            options: { prompt: "login" },
          })
        }
      >
        Sign in
      </button>
    </div>
  );
}
