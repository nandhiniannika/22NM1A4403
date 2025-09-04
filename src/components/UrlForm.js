import React, { useState } from "react";
import { Paper, TextField, Button, Stack, Alert } from "@mui/material";
import { isValidUrl, isValidMinutes, isValidShortcode } from "../utils/validator";
import { generateCode } from "../utils/generator";
import { useLogger } from "../utils/logger";
import "./UrlForm.css";


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

  const handleCreateLink = (e) => {
    e.preventDefault();
    setError("");

    const links = readLinks();
    const activeLinks = links.filter((l) => !isExpired(l));

    if (activeLinks.length >= 5) {
      setError("You can only keep 5 active links at once. Please clear some before adding new ones.");
      logger.warn("Max active links reached");
      return;
    }

    if (!isValidUrl(longUrl)) {
      setError("That doesn’t look like a valid URL. Please double-check and try again.");
      return;
    }

    if (!isValidMinutes(minutes)) {
      setError("Please enter valid minutes (0–1440).");
      return;
    }

    if (!isValidShortcode(shortcode)) {
      setError("Shortcode must be 3–20 characters (letters, numbers, _ or -).");
      return;
    }

    const ttl = minutes === "" ? 30 : Number(minutes);
    let code = shortcode || generateCode();

    if (links.find((l) => l.code === code)) {
      setError(`The shortcode “${code}” is already taken. Try something else.`);
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
    <Paper elevation={3} className="url-form-container">
      <form onSubmit={handleCreateLink} className="url-form">
        <Stack spacing={2} padding={2} className="url-form-fields">
          {error && (
            <Alert severity="error" className="url-form-error">
              {error}
            </Alert>
          )}

          <TextField
            label="Paste your long URL"
            placeholder="https://example.com/some/long/link"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            fullWidth
            className="url-input"
          />

          <TextField
            label="How long should it stay active? (minutes)"
            placeholder="Default is 30"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            fullWidth
            className="ttl-input"
          />

          <TextField
            label="Custom Shortcode (optional)"
            placeholder="e.g., my-link"
            value={shortcode}
            onChange={(e) => setShortcode(e.target.value)}
            fullWidth
            className="shortcode-input"
          />

          <Button type="submit" variant="contained" className="create-link-button">
            Create Short Link
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}

export default UrlForm;
