import { Amplify } from "aws-amplify";

const userPoolId = import.meta.env.VITE_COGNITO_USER_POOL_ID;
const clientId = import.meta.env.VITE_COGNITO_APP_CLIENT_ID;

// IMPORTANT: domain MUST NOT include https:// or http://
const domain = (import.meta.env.VITE_COGNITO_DOMAIN || "")
  .replace("https://", "")
  .replace("http://", "")
  .replace(/\/$/, "");

// ✅ Always use the same origin the app is currently running on
const origin = window.location.origin;

// If your callback route is exactly "/callback" (based on your earlier code)
const redirectSignIn = [`${origin}/callback`];

// Change this to `${origin}/login` ONLY if your app truly routes to /login after sign out
const redirectSignOut = [`${origin}/`];

console.log("AMPLIFY CONFIG LOADED", {
  userPoolId,
  clientId,
  domain,
  redirectSignIn,
  redirectSignOut,
});

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId,
      userPoolClientId: clientId,
      loginWith: {
        oauth: {
          domain,
          scopes: ["openid", "email", "profile"],
          redirectSignIn,
          redirectSignOut,
          responseType: "code",
        },
      },
    },
  },
});
