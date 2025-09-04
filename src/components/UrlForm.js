import React, { useState } from "react";
import { Paper, TextField, Button, Stack, Alert } from "@mui/material";
import { isValidUrl, isValidMinutes, isValidShortcode } from "../utils/validator";
import { generateCode } from "../utils/generator";
import { useLogger } from "../utils/logger";

const STORAGE_KEY = "short_links";

function readLinks() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveLinks(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function UrlForm() {
  const [longUrl, setLongUrl] = useState("");
  const [minutes, setMinutes] = useState("");
  const [shortcode, setShortcode] = useState("");
  const [error, setError] = useState("");

  const logger = useLogger();

  const createLink = (e) => {
    e.preventDefault();
    setError("");

    const links = readLinks();
    const activeLinks = links.filter((l) => !isExpired(l));

    if (activeLinks.length >= 5) {
      setError("You already have 5 active links.");
      logger.warn("Max active links reached");
      return;
    }

    if (!isValidUrl(longUrl)) {
      setError("Invalid URL.");
      return;
    }

    if (!isValidMinutes(minutes)) {
      setError("Minutes must be an integer (0–1440).");
      return;
    }

    if (!isValidShortcode(shortcode)) {
      setError("Shortcode must be 3–20 chars (letters, numbers, _ or -).");
      return;
    }

    const ttl = minutes === "" ? 30 : Number(minutes);
    let code = shortcode || generateCode();

    if (links.find((l) => l.code === code)) {
      setError("Shortcode already exists.");
      logger.warn("Shortcode collision", { code });
      return;
    }

    const newItem = {
      id: crypto.randomUUID(),
      code,
      url: longUrl,
      created: Date.now(),
      ttl,
      clicks: 0,
    };

    links.unshift(newItem);
    saveLinks(links);
    logger.info("Created new short link", { code });

    setLongUrl("");
    setMinutes("");
    setShortcode("");
    window.dispatchEvent(new Event("storage"));
  };

  function isExpired(item) {
    return Date.now() > item.created + item.ttl * 60000;
  }

  return (
    <Paper elevation={3}>
      <form onSubmit={createLink}>
        <Stack spacing={2} padding={2}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Enter URL"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            fullWidth
          />
          <TextField
            label="Validity (minutes)"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            fullWidth
          />
          <TextField
            label="Custom Shortcode"
            value={shortcode}
            onChange={(e) => setShortcode(e.target.value)}
            fullWidth
          />
          <Button type="submit" variant="contained">
            Shorten
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}

export default UrlForm;
