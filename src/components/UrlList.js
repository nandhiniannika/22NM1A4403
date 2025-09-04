import React, { useEffect, useState } from "react";
import { Stack, Typography, Paper } from "@mui/material";
import ResultCard from "./ResultCard";
import "./UrlList.css";


const STORAGE_KEY = "short_links";

function loadLinks() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function UrlList() {
  const [links, setLinks] = useState(loadLinks());

  useEffect(() => {
    const refresh = () => setLinks(loadLinks());
    window.addEventListener("storage", refresh);
    return () => window.removeEventListener("storage", refresh);
  }, []);

  if (links.length === 0) {
    return (
      <Paper
        elevation={2}
        className="url-list-empty"
      >
        <Typography variant="h6" gutterBottom className="url-list-empty-title">
          🚀 No links yet
        </Typography>
        <Typography color="text.secondary" className="url-list-empty-subtitle">
          Start by pasting a URL above and create your very first short link!
        </Typography>
      </Paper>
    );
  }

  return (
    <Stack spacing={2} className="url-list">
      {links.map((link) => (
        <ResultCard key={link.id} link={link} />
      ))}
    </Stack>
  );
}

export default UrlList;
