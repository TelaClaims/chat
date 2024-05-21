import { useChat, useChatDispatch } from "@/package/context/Chat/context";
import { Box } from "@mui/material";

export const MessageBackdrop = () => {
  const { selectedMessage } = useChat();
  const { selectMessage } = useChatDispatch();

  if (!selectedMessage) return null;

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
      }}
    />
  );
};
