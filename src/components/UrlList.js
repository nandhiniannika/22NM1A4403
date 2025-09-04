import React, { useEffect, useState } from "react";
import { Stack, Typography } from "@mui/material";
import ResultCard from "./ResultCard";

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
    return <Typography>No URLs have been shortened yet.</Typography>;
  }

  return (
    <Stack spacing={2}>
      {links.map((link) => (
        <ResultCard key={link.id} link={link} />
      ))}
    </Stack>
  );
}

export default UrlList;
