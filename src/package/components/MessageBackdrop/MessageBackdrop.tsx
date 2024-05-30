import { useChat, useChatDispatch } from "@/package/context/Chat/context";
import { Box, CircularProgress } from "@mui/material";

export const MessageBackdrop = () => {
  const { selectedMessage, goingToMessage } = useChat();
  const { selectMessage } = useChatDispatch();

  if (!selectedMessage && !goingToMessage?.isGoing) return null;

  return (
    <Box
      onClick={() => selectMessage()}
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
        backdropFilter: "blur(3px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {goingToMessage?.isGoing && (
        <CircularProgress color="primary" size={60} />
      )}
    </Box>
  );
};
