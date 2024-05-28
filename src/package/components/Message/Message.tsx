import { Message, User } from "@twilio/conversations";
import { useChat, useChatDispatch } from "@/package/context/Chat/context";
import { Box, ListItem, Typography, colors } from "@mui/material";
import { useCallback, useMemo, useRef, useState } from "react";
import { useMessageReadIntersection } from "./useMessageReadIntersection";
import CheckIcon from "@mui/icons-material/Check";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { MessageMenu } from "../MessageMenu/MessageMenu";
import { useOnMessageUpdated } from "@/package/hooks";
import { getContact } from "@/package/utils";
import { MediaMessage } from "./MediaMessage/MediaMessage";
interface Props {
  message: Message;
  isRead: boolean;
}

export const MessageUI = ({ message, isRead }: Props) => {
  const { contact, activeConversation } = useChat();
  const { selectMessage } = useChatDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const messageRef = useRef(null);
  useMessageReadIntersection({ message, ref: messageRef });

  const { updatedMessageBy } = useOnMessageUpdated({ message });

  const authorUser = useMemo(
    () =>
      activeConversation?.partyUsers.find(
        (user) => user.identity === message.author
      ),
    [activeConversation, message.author]
  );

  const authorContact = useMemo(
    () => authorUser && getContact(authorUser as User),
    [authorUser]
  );

  const direction =
    message.author === contact.identity ? "outgoing" : "incoming";

  const handleMouseEnter = useCallback(() => {
    if (direction === "outgoing") setShowMenu(true);
  }, [direction]);

  const handleMouseLeave = useCallback(() => {
    if (direction === "outgoing") setShowMenu(false);
  }, [direction]);

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
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {direction === "outgoing" && showMenu && (
        <MessageMenu
          onClickOption={(reason) => selectMessage(message, reason)}
          hiddenOptions={message.type === "media" ? ["copy", "edit"] : []}
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
          <Box display={"flex"} alignItems={"center"} gap={1}>
            <Typography variant={"caption"} fontWeight={"600"}>
              {authorContact?.label || message.author}
            </Typography>
          </Box>
        )}
        <Typography
          variant={"body2"}
          sx={{
            overflowWrap: "break-word",
          }}
        >
          {message.attachedMedia?.length && (
            <MediaMessage media={message.attachedMedia[0]} />
          )}
          {message.body}
        </Typography>
        <Box
          display={"flex"}
          alignItems={"center"}
          gap={1}
          justifyContent={direction === "incoming" ? "flex-start" : "flex-end"}
        >
          <Typography
            variant="subtitle2"
            fontSize={11}
            textAlign={direction === "incoming" ? "left" : "right"}
            sx={{
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
