// src/authConfig.ts
import {
  InteractionType,
  BrowserCacheLocation,
  LogLevel,
} from "@azure/msal-browser";

export const msalConfig = {
  auth: {
    clientId: "YOUR_AZURE_AD_CLIENT_ID",
    authority: "https://login.microsoftonline.com/YOUR_TENANT_ID",
    redirectUri: "http://localhost:3000",
  },
  cache: {
    cacheLocation: BrowserCacheLocation.LocalStorage,
  },
  system: {
    loggerOptions: {
      loggerCallback(logLevel, message) {
        console.log(message);
      },
      logLevel: LogLevel.Verbose,
    },
  },
};

export const loginRequest = {
  scopes: ["openid", "profile", "User.Read"],
  prompt: InteractionType.Popup,
};
