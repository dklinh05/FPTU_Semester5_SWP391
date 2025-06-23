import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import GlobalStyles from "./components/GlobalStyles";
import App from "./App.jsx";
import "leaflet/dist/leaflet.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GlobalStyles>
      <App />
    </GlobalStyles>
  </StrictMode>
);
