import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import theme from "./theme/theme";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Added locator runtime setup for development
import setupLocatorUI from "@locator/runtime";

if (process.env.NODE_ENV === "development") {
  setupLocatorUI();
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
