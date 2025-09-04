import React, { useState } from "react";
import "./ResultCard.css";

import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Chip,
} from "@mui/material";
import { useLogger } from "../utils/logger";

const STORAGE_KEY = "short_links";

function saveLinks(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function ResultCard({ link }) {
  const logger = useLogger();
  const [copied, setCopied] = useState(false);

  const shortUrl = `${window.location.origin}/${link.code}`;

  const isExpired = () => Date.now() > link.created + link.ttl * 60000;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl).then(() => {
      setCopied(true);
      logger.info("Copied short link", { shortUrl });
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const removeLink = () => {
    let list = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    list = list.filter((x) => x.id !== link.id);
    saveLinks(list);
    logger.warn("Removed short link", { code: link.code });
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <Card className="link-card">
      <CardContent className="link-content">
        <Stack spacing={1} className="link-details">
          <Typography variant="body1" className="original-link">
            <strong>Original Link:</strong> {link.url}
          </Typography>
          <Typography variant="body2" className="short-link">
            <strong>Short Link:</strong>{" "}
            <a
              href={shortUrl}
              target="_blank"
              rel="noreferrer"
              className="short-link-anchor"
            >
              {shortUrl}
            </a>
          </Typography>

          {/* Status section */}
          <Stack direction="row" spacing={1} className="status-section">
            <Chip
              label={isExpired() ? "⛔ Expired" : "🟢 Active"}
              color={isExpired() ? "error" : "success"}
              className="status-chip"
            />
            <Chip
              label={`🔗 Clicked ${link.clicks} times`}
              className="clicks-chip"
            />
            <Chip
              label={`⏳ Valid for ${link.ttl} minute${
                link.ttl > 1 ? "s" : ""
              }`}
              className="ttl-chip"
            />
          </Stack>

          {/* Actions */}
          <Stack direction="row" spacing={2} className="action-buttons">
            <Button
              variant="outlined"
              onClick={copyToClipboard}
              className="copy-button"
            >
              {copied ? "✅ Copied to Clipboard!" : "📋 Copy Link"}
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={removeLink}
              className="delete-button"
            >
              🗑️ Remove
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default ResultCard;
