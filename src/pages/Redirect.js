import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, CircularProgress, Stack, Button } from "@mui/material";
import { useLogger } from "../utils/logger";

const STORAGE_KEY = "short_links";

function Redirect() {
  const { code } = useParams();
  const [message, setMessage] = useState("✨ Hang tight… we’re getting your link ready!");
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const logger = useLogger();

  useEffect(() => {
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const item = list.find((x) => x.code === code);

    if (!item) {
      setMessage("⚠️ Oops! This short link doesn’t exist.");
      setError(true);
      logger.error("Shortcode not found", { code });
      return;
    }

    const expired = Date.now() > item.created + item.ttl * 60000;
    if (expired) {
      setMessage("⏳ This short link has expired. Try creating a new one!");
      setError(true);
      logger.warn("Tried to open expired link", { code });
      return;
    }

    // Update clicks and redirect
    item.clicks += 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    logger.info("Redirecting to original URL", { code, url: item.url });

    setTimeout(() => {
      window.location.href = item.url;
    }, 1200);
  }, [code, logger]);

  return (
    <Stack spacing={3} alignItems="center" marginTop={8} className="redirect-container">
      {!error && <CircularProgress className="redirect-loader" />}
      <Typography variant="h6" textAlign="center" className="redirect-message">
        {message}
      </Typography>

      {error && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/")}
          className="redirect-home-btn"
        >
          🏠 Back to Home
        </Button>
      )}
    </Stack>
  );
}

export default Redirect;
