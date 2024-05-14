import { Message } from "@twilio/conversations";
import { useChat } from "@/package/context/Chat/context";
import { Box, ListItem, Typography, colors } from "@mui/material";
import { useRef, useState } from "react";
import { useMessageReadIntersection } from "./useMessageReadIntersection";
import CheckIcon from "@mui/icons-material/Check";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { MessageMenu } from "../MessageMenu/MessageMenu";
import { useOnMessageUpdated } from "@/package/hooks";
interface Props {
  message: Message;
  isRead: boolean;
  onSelectMessage: (message: Message, reason: "edit") => void;
}

export const MessageUI = ({ message, isRead, onSelectMessage }: Props) => {
  const { contact } = useChat();
  const [showMenu, setShowMenu] = useState(false);
  const messageRef = useRef(null);
  useMessageReadIntersection({ message, ref: messageRef });

  const { updatedMessageBy } = useOnMessageUpdated({ message });

  const direction =
    message.author === contact.identity ? "outgoing" : "incoming";

  return (
    <ListItem
      ref={messageRef}
      id={message.sid}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: direction === "incoming" ? "flex-start" : "flex-end",
        width: "100%",
        py: 0.3,
        position: "relative",
      }}
      onMouseEnter={() => direction === "outgoing" && setShowMenu(true)}
      onMouseLeave={() => direction === "outgoing" && setShowMenu(false)}
    >
      {direction === "outgoing" && showMenu && (
        <MessageMenu
          onClickOption={(reason) => onSelectMessage(message, reason)}
        />
      )}
      <Box
        maxWidth={"80%"}
        bgcolor={direction === "incoming" ? colors.grey[300] : colors.green[50]}
        color={colors.grey[900]}
        p={1}
        mb={0.5}
        borderRadius={"10px"}
      >
        {direction === "incoming" && (
          <Typography variant={"caption"} fontWeight={"600"}>
            {message.author}
          </Typography>
        )}
        <Typography variant={"body2"}>{message.body}</Typography>
        <Box display={"flex"} alignItems={"center"} gap={1}>
          <Typography
            variant="subtitle2"
            fontSize={10}
            textAlign={direction === "incoming" ? "left" : "right"}
            sx={{
              alignSelf: direction === "incoming" ? "flex-start" : "flex-end",
              color: colors.grey[600],
            }}
          >
            {`${
              updatedMessageBy && "Edited"
            } ${message.dateUpdated?.toLocaleTimeString()}`}
          </Typography>
          {direction === "outgoing" &&
            (isRead ? (
              <DoneAllIcon color="primary" sx={{ fontSize: 14 }} />
            ) : (
              <CheckIcon color="disabled" sx={{ fontSize: 14 }} />
            ))}
        </Box>
      </Box>
    </ListItem>
  );
};
