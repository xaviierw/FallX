import { Amplify } from "aws-amplify";

const userPoolId = import.meta.env.VITE_COGNITO_USER_POOL_ID;
const clientId = import.meta.env.VITE_COGNITO_APP_CLIENT_ID;

// IMPORTANT: domain MUST NOT include https://
const domain = import.meta.env.VITE_COGNITO_DOMAIN.replace("https://", "").replace("http://", "");

const redirectSignIn = [import.meta.env.VITE_REDIRECT_SIGN_IN];
const redirectSignOut = [import.meta.env.VITE_REDIRECT_SIGN_OUT];

console.log("AMPLIFY CONFIG LOADED", { userPoolId, clientId, domain, redirectSignIn, redirectSignOut });

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
