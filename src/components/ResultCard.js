import React, { useState } from "react";
import { Card, CardContent, Typography, Button, Stack, Chip } from "@mui/material";
import { useLogger } from "../utils/logger";

const STORAGE_KEY = "short_links";

function saveLinks(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function ResultCard({ link }) {
  const logger = useLogger();
  const [copied, setCopied] = useState(false);

  const shortUrl = `${window.location.origin}/${link.code}`;

  const isExpired = () => {
    return Date.now() > link.created + link.ttl * 60000;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl).then(() => {
      setCopied(true);
      logger.info("Copied URL", { shortUrl });
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDelete = () => {
    let list = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    list = list.filter((x) => x.id !== link.id);
    saveLinks(list);
    logger.warn("Deleted short link", { code: link.code });
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <Card>
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="body1">
            <strong>Original:</strong> {link.url}
          </Typography>
          <Typography variant="body2">
            <strong>Short:</strong>{" "}
            <a href={shortUrl} target="_blank" rel="noreferrer">
              {shortUrl}
            </a>
          </Typography>
          <Stack direction="row" spacing={1}>
            <Chip
              label={isExpired() ? "Expired" : "Active"}
              color={isExpired() ? "error" : "success"}
            />
            <Chip label={`Clicks: ${link.clicks}`} />
            <Chip label={`Valid ${link.ttl} min`} />
          </Stack>
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" onClick={handleCopy}>
              {copied ? "Copied!" : "Copy"}
            </Button>
            <Button variant="outlined" color="error" onClick={handleDelete}>
              Delete
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default ResultCard;
