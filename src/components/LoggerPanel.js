import React from "react";
import { Paper, Typography, List, ListItem, ListItemText, Button, Stack } from "@mui/material";
import { useLogger } from "../utils/logger";

function LoggerPanel() {
  const { useLogs, clear } = useLogger();
  const logs = useLogs();

  return (
    <Paper elevation={2}>
      <Stack spacing={2} padding={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Application Logs</Typography>
          <Button variant="outlined" color="error" onClick={clear}>
            Clear
          </Button>
        </Stack>
        <List>
          {logs.map((log) => (
            <ListItem key={log.id}>
              <ListItemText
                primary={`${log.time} [${log.level.toUpperCase()}] ${log.msg}`}
                secondary={log.meta ? JSON.stringify(log.meta) : ""}
              />
            </ListItem>
          ))}
          {logs.length === 0 && <Typography>No logs yet.</Typography>}
        </List>
      </Stack>
    </Paper>
  );
}

export default LoggerPanel;
