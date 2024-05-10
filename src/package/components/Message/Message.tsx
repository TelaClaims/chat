import { Message } from "@twilio/conversations";
import { useChat } from "@/package/context/Chat/context";
import { Box, ListItem, Typography, colors } from "@mui/material";

interface Props {
  message: Message;
}

export const MessageUI = ({ message }: Props) => {
  const { contact } = useChat();

  const direction =
    message.author === contact.identity ? "outgoing" : "incoming";

  return (
    <ListItem
      id={message.sid}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: direction === "incoming" ? "flex-start" : "flex-end",
        width: "100%",
        py: 0.3,
      }}
    >
      <Box
        maxWidth={"80%"}
        bgcolor={direction === "incoming" ? colors.grey[300] : colors.green[50]}
        color={colors.grey[900]}
        p={1}
        borderRadius={"10px"}
      >
        {direction === "incoming" && (
          <Typography variant={"caption"} fontWeight={"600"}>
            {message.author}
          </Typography>
        )}
        <Typography variant={"body2"}>{message.body}</Typography>
      </Box>
      <Typography
        variant="caption"
        sx={{
          alignSelf: direction === "incoming" ? "flex-start" : "flex-end",
          color: colors.grey[600],
        }}
      >
        {message.dateUpdated?.toLocaleTimeString()}
      </Typography>
    </ListItem>
  );
};
