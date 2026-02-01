import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";

export default function Callback() {
  const navigate = useNavigate();
  const ran = useRef(false);
console.log("CALLBACK URL:", window.location.href);
console.log("CALLBACK PARAMS:", Object.fromEntries(new URLSearchParams(window.location.search)));

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    const finish = async () => {
      try {
        for (let i = 0; i < 10; i++) {
          try {
            await getCurrentUser();
            const session = await fetchAuthSession();
            const idToken = session.tokens?.idToken?.toString();
            if (idToken) {
              navigate("/dashboard", { replace: true });
              return;
            }
          } catch (e) {
            
          }
          await sleep(300);
        }

        throw new Error("No token found after sign-in (callback did not complete)");
      } catch (e) {
        console.error(e);
        navigate("/", { replace: true });
      }
    };

    finish();
  }, [navigate]);

  return <div style={{ padding: 24 }}>Signing you in…</div>;
}
