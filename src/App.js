import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UrlForm from "./components/UrlForm";
import UrlList from "./components/UrlList";
import LoggerPanel from "./components/LoggerPanel";
import RedirectPage from "./pages/Redirect";
import { LoggerProvider } from "./utils/logger";
import "./App.css"; // ✅ import global styles

function App() {
  return (
    <LoggerProvider>
      <Router>
        <div className="app-container">
          <h1 className="app-title">URL Shortener</h1>
          <UrlForm />
          <UrlList />
          <LoggerPanel />
        </div>
        <Routes>
          <Route path="/:shortcode" element={<RedirectPage />} />
        </Routes>
      </Router>
    </LoggerProvider>
  );
}

export default App;
