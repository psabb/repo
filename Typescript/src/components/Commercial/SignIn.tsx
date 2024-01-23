// src/components/SignIn.tsx
import React, { useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";

const SignIn: React.FC = () => {
  const { instance, accounts, inProgress, error, login } = useMsal();

  useEffect(() => {
    if (!accounts.length && !inProgress) {
      login(loginRequest);
    }
  }, [accounts, inProgress, login]);

  return (
    <div>
      <h2>Sign In</h2>
      {inProgress && <p>Signing in...</p>}
      {error && <p>An error occurred: {error}</p>}
    </div>
  );
};

export default SignIn;
