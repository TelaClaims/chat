import { Box, IconButton, Typography } from "@mui/material";
import CloseRounded from "@mui/icons-material/CloseRounded";
import { Message } from "@twilio/conversations";
import { useChat } from "@/package/context/Chat/context";
import { getRandomColor } from "@/package/utils";

interface Props {
  message: Message;
  onClose: () => void;
}

export const MessageSelectedPlaceHolder = ({ message, onClose }: Props) => {
  const { client } = useChat();

  const randomColor = getRandomColor();

  return (
    <Box
      sx={{
        borderLeft: `5px solid ${randomColor}`,
        bgcolor: "grey.200",
        display: "flex",
        borderRadius: 1,
        pl: 1,
        pb: 1,
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          overflow: "hidden",
          textAlign: "justify",
        }}
      >
        <Typography variant={"caption"} color={"text.secondary"}>
          {message.author === client?.user.identity ? "You" : message.author}
        </Typography>
        <Typography
          variant={"body1"}
          sx={{
            wordWrap: "break-word",
            whiteSpace: "pre-wrap",
          }}
        >
          {message.body}
        </Typography>
      </Box>
      <Box>
        <IconButton onClick={onClose}>
          <CloseRounded fontSize={"small"} />
        </IconButton>
      </Box>
    </Box>
  );
};
