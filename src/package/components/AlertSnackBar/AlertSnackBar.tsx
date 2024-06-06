import { Alert, Box, Collapse, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { log } from "../../utils";
import { useChat } from "@/package/context/Chat/context";

interface AlertState {
  open: boolean;
  severity: "error" | "warning" | "info" | "success";
  message?: string;
}

export const AlertSnackBar = () => {
  const chat = useChat();

  const [alert, setAlert] = useState<AlertState>({
    open: false,
    severity: "info",
    message: "",
  });

  useEffect(() => {
    if (chat.alert) {
      setAlert({
        open: true,
        severity: chat.alert.type,
        message: chat.alert.message,
      });
      if (chat.alert.type === "error") {
        log("error", chat.alert);
      }
    } else {
      setAlert({ open: false, severity: "info", message: "" });
    }
  }, [chat.alert]);

  return (
    <Box position={"relative"} zIndex={1000}>
      <Collapse
        in={alert.open}
        sx={{ position: "absolute", bottom: "0", width: "100%" }}
      >
        <Alert
          elevation={3}
          sx={{
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
          severity={alert.severity}
          variant="filled"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setAlert({ ...alert, open: false });
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {alert.message}
        </Alert>
      </Collapse>
    </Box>
  );
};
