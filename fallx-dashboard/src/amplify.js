import { Amplify } from "aws-amplify";

const userPoolId = import.meta.env.VITE_COGNITO_USER_POOL_ID;
const clientId = import.meta.env.VITE_COGNITO_APP_CLIENT_ID;
const domain = (import.meta.env.VITE_COGNITO_DOMAIN || "")
  .replace("https://", "")
  .replace("http://", "")
  .replace(/\/$/, "");

const origin = window.location.origin;
const redirectSignIn = [`${origin}/callback`];
const redirectSignOut = [`${origin}/`];

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