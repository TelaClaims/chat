import { Message } from "@twilio/conversations";
import { useChat, useChatDispatch } from "@/package/context/Chat/context";
import { Box, Chip, ListItem, Typography, colors } from "@mui/material";
import { useRef, useState } from "react";
import { useMessageReadIntersection } from "./useMessageReadIntersection";
import CheckIcon from "@mui/icons-material/Check";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { MessageMenu } from "../MessageMenu/MessageMenu";
import { useOnMessageUpdated } from "@/package/hooks";
import { MediaMessage } from "./MediaMessage/MediaMessage";
import {
  ContextMenuItem,
  DefaultContextMenuOptions,
  Handlers,
  MessageAttributes,
} from "@/package/types";

interface Props {
  message: Message;
  isRead: boolean;
  onClickTag?: Handlers["onClickTag"];
}

export const MessageUI = ({ message, isRead, onClickTag }: Props) => {
  const { contact, messagesExtendedContextMenu, goingToMessage } = useChat();
  const { selectMessage } = useChatDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const messageRef = useRef(null);
  useMessageReadIntersection({ message, ref: messageRef });

  const { updatedMessageBy } = useOnMessageUpdated({ message });

  const direction =
    message.author === contact.identity ? "outgoing" : "incoming";

  const onClickExtendedOption = (extendedOption: ContextMenuItem) => {
    extendedOption.onClick(message);
  };

  const getHiddenOptions = (): DefaultContextMenuOptions[] => {
    if (direction === "outgoing") {
      if (message.type === "media") {
        return ["copy", "edit"];
      }

      return [];
    }

    if (direction === "incoming") {
      return ["edit", "delete"];
    }

    return [];
  };

  const messageAttributes = message.attributes as MessageAttributes;
  const { tags } = messageAttributes;

  return (
    <ListItem
      ref={messageRef}
      id={message.sid}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: direction === "incoming" ? "flex-start" : "flex-end",
        width: "100%",
        py: 0.5,
        position: "relative",
        bgcolor:
          goingToMessage?.index === message.index
            ? colors.yellow["500"]
            : "transparent",
      }}
    >
      <Box
        maxWidth={"80%"}
        bgcolor={direction === "incoming" ? colors.grey[300] : colors.green[50]}
        color={colors.grey[900]}
        p={1}
        borderRadius={"10px"}
        onMouseEnter={() => setShowMenu(true)}
        onMouseLeave={() => setShowMenu(false)}
      >
        {/* Menu section */}
        {showMenu && (
          <Box
            display={"flex"}
            justifyContent={
              direction === "outgoing" ? "flex-end" : "flex-start"
            }
          >
            <MessageMenu
              onClickOption={(reason) => selectMessage(message, reason)}
              onClickExtendedOption={(option) => onClickExtendedOption(option)}
              hiddenOptions={getHiddenOptions()}
              extendedContextMenu={messagesExtendedContextMenu?.filter(
                (item) =>
                  item.direction === "both" || item.direction === direction
              )}
            />
          </Box>
        )}

        {/* Body section */}
        <Typography
          variant={"body2"}
          sx={{
            overflowWrap: "break-word",
          }}
        >
          {message.attachedMedia?.[0] && (
            <MediaMessage media={message.attachedMedia[0]} />
          )}
          {message.index}
          {/* {message.body} */}
        </Typography>

        {/* Time and read status section */}
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

        {/* Tags section */}
        <Box
          display={"flex"}
          flexWrap={"wrap"}
          gap={0.5}
          justifyContent={direction === "outgoing" ? "flex-end" : "flex-start"}
        >
          {tags?.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              variant="outlined"
              onClick={() => onClickTag?.(tag, message)}
              sx={{
                height: "24px",
                fontSize: 12,
                color: colors.blue[700],
                borderColor: colors.blue[700],
                "&:hover": {
                  backgroundColor: colors.blue[50],
                },
                margin: "2px",
              }}
            />
          ))}
        </Box>
      </Box>
    </ListItem>
  );
};
