import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { StyledEngineProvider } from "@mui/material/styles";
import { IntlProvider } from "react-intl";
import { Provider } from "react-redux";
import App from "./Router/App.jsx";
import esMessages from "./Locales/es.json";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./Redux/Store.js";

import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <StyledEngineProvider injectFirst>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <IntlProvider locale="es" messages={esMessages}>
            <App />
          </IntlProvider>
        </PersistGate>
      </Provider>
    </StyledEngineProvider>
  </StrictMode>
);
