import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UrlForm from "./components/UrlForm";
import UrlList from "./components/UrlList";
import LoggerPanel from "./components/LoggerPanel";
import RedirectPage from "./pages/Redirect";
import { LoggerProvider } from "./utils/logger";  // ✅ import provider

function App() {
  return (
    <LoggerProvider>   {/* ✅ wrap the whole app */}
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <div style={{ padding: "20px" }}>
                <h1>URL Shortener</h1>
                <UrlForm />
                <UrlList />
                <LoggerPanel />
              </div>
            }
          />
          <Route path="/:shortcode" element={<RedirectPage />} />
        </Routes>
      </Router>
    </LoggerProvider>
  );
}

export default App;
