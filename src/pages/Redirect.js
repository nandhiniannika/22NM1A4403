import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, CircularProgress, Stack } from "@mui/material";
import { useLogger } from "../utils/logger";

const STORAGE_KEY = "short_links";

function Redirect() {
  const { code } = useParams();
  const [message, setMessage] = useState("Redirecting...");
  const navigate = useNavigate();
  const logger = useLogger();

  useEffect(() => {
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const item = list.find((x) => x.code === code);

    if (!item) {
      setMessage("Shortcode not found.");
      logger.error("Shortcode not found", { code });
      return;
    }

    const expired = Date.now() > item.created + item.ttl * 60000;
    if (expired) {
      setMessage("This link has expired.");
      logger.warn("Tried to open expired link", { code });
      return;
    }

    item.clicks += 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    logger.info("Redirecting to original URL", { code, url: item.url });

    setTimeout(() => {
      window.location.href = item.url;
    }, 1000);
  }, [code, logger, navigate]);

  return (
    <Stack spacing={2} alignItems="center" marginTop={4}>
      <CircularProgress />
      <Typography>{message}</Typography>
    </Stack>
  );
}

export default Redirect;
