import { Box, Collapse, IconButton, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoIcon from "@mui/icons-material/Info";
import { useState } from "react";
import { useChat } from "@/package/context/Chat/context";

export const Status = () => {
  const { contact, client } = useChat();

  const [open, setOpen] = useState(false);

  return (
    <Box position={"relative"} zIndex={999}>
      <Collapse
        in={open}
        sx={{ position: "absolute", bottom: "0", width: "100%" }}
      >
        <Box
          bgcolor={"whitesmoke"}
          color={"GrayText"}
          sx={{ whiteSpace: "pre-wrap" }}
          px={1}
          fontFamily={"monospace"}
          display={"flex"}
          flexDirection={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Typography variant="caption">
            {`Identity: `}
            <Typography variant="caption" component={"span"} fontWeight={"500"}>
              {contact.identity || "unknown"}
            </Typography>
          </Typography>
          <Typography variant="caption">
            {`Status: `}
            <Typography variant="caption" component={"span"} fontWeight={"500"}>
              {client?.connectionState || "unavailable"}
            </Typography>
          </Typography>
          <Typography variant="caption">
            {`Ready: `}
            <Typography variant="caption" component={"span"} fontWeight={"500"}>
              {client?.connectionState === "connected" ? "yes" : "no"}
            </Typography>
          </Typography>
          <IconButton size="small" onClick={() => setOpen(false)}>
            <ExpandMoreIcon />
          </IconButton>
        </Box>
      </Collapse>
      {!open && (
        <Box position={"absolute"} right={8} bottom={0}>
          <IconButton size="small" onClick={() => setOpen(true)}>
            <InfoIcon />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};
