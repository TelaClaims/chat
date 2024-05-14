import { Box, Divider, Typography } from "@mui/material";
import { Message } from "@twilio/conversations";

interface Props {
  isFirstMessage: boolean;
  message: Message;
  beforeMessage?: Message;
}

export const MessageDateLine = ({
  message,
  beforeMessage,
  isFirstMessage,
}: Props) => {
  if (
    !isFirstMessage &&
    message.dateCreated?.toLocaleDateString() ===
      beforeMessage?.dateCreated?.toLocaleDateString()
  )
    return null;

  return (
    <Box display="flex" alignItems="center">
      <Divider sx={{ flex: 1 }} />
      <Typography variant="body2" sx={{ mx: 2 }}>
        {message.dateCreated?.toLocaleDateString()}
      </Typography>
      <Divider sx={{ flex: 1 }} />
    </Box>
  );
};
