import React from "react";
import "./LoggerPanel.css";

import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Stack,
} from "@mui/material";
import { useLogger } from "../utils/logger";

function LoggerPanel() {
  const { useLogs, clear } = useLogger();
  const logs = useLogs();

  return (
    <Paper elevation={3} className="activity-panel">
      <Stack spacing={2} padding={2} className="activity-container">
        {/* Header */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          className="activity-header"
        >
          <Typography variant="h6" className="activity-title">
            Your Recent Activity
          </Typography>
          <Button
            variant="outlined"
            color="error"
            onClick={clear}
            className="clear-button"
          >
            Clear History
          </Button>
        </Stack>

        {/* Activity list */}
        {logs.length > 0 ? (
          <List className="act-list">
            {logs.map((log) => (
              <ListItem key={log.id} divider className="act-item">
                <ListItemText
                  primary={`[${log.level.toUpperCase()}] ${log.msg}`}
                  secondary={`⏰ ${log.time}${
                    log.meta ? " • " + JSON.stringify(log.meta) : ""
                  }`}
                  className="act-text"
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography
            color="text.secondary"
            className="empty-state"
          >
            ✨ No activity yet! Shorten a link and your actions will appear here.
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}

export default LoggerPanel;
