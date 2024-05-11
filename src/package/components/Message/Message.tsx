import {
  Message,
  Participant,
  ParticipantUpdateReason,
} from "@twilio/conversations";
import { useChat } from "@/package/context/Chat/context";
import { Box, ListItem, Typography, colors } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useMessageRead } from "./useMessageRead";
import CheckIcon from "@mui/icons-material/Check";
import DoneAllIcon from "@mui/icons-material/DoneAll";
interface Props {
  message: Message;
  partyParticipants?: Participant[];
}

export const MessageUI = ({ message, partyParticipants }: Props) => {
  const { contact } = useChat();
  const messageRef = useRef(null);
  const [isRead, setIsRead] = useState<boolean>();
  useMessageRead({ message, ref: messageRef });

  useEffect(() => {
    const onParticipantUpdated = ({
      participant,
      updateReasons,
    }: {
      participant: Participant;
      updateReasons: ParticipantUpdateReason[];
    }) => {
      if (updateReasons.includes("lastReadMessageIndex")) {
        if (participant.lastReadMessageIndex) {
          setIsRead(participant.lastReadMessageIndex >= message.index);
        }
      }
    };

    partyParticipants?.forEach((participant) => {
      participant.on("updated", onParticipantUpdated);
    });

    if (partyParticipants?.[0].lastReadMessageIndex) {
      setIsRead(message.index <= partyParticipants[0].lastReadMessageIndex);
    }

    return () => {
      partyParticipants?.forEach((participant) => {
        participant.off("updated", onParticipantUpdated);
      });
    };
  }, [message.index, partyParticipants]);

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
      }}
    >
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
            {message.dateUpdated?.toLocaleTimeString()}
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
