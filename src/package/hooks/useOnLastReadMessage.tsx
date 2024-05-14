import {
  Conversation,
  Participant,
  ParticipantUpdateReason,
} from "@twilio/conversations";
import { useEffect, useState } from "react";
import { useChat } from "../context/Chat/context";

export const useOnLastReadMessage = (conversation: Conversation) => {
  const { client } = useChat();
  const [
    lastMessageIndexReadByParticipants,
    setLastMessageIndexReadByParticipants,
  ] = useState(0);

  useEffect(() => {
    const checkLastReadMessageIndex = () => {
      const partyParticipants = Array.from(
        conversation._participants.values()
      ).filter((participant) => participant.identity !== client?.user.identity);

      let messageIndex = 0;

      partyParticipants.forEach((participant) => {
        if (participant.lastReadMessageIndex) {
          if (messageIndex === 0) {
            messageIndex = participant.lastReadMessageIndex;
          } else {
            if (participant.lastReadMessageIndex < messageIndex) {
              messageIndex = participant.lastReadMessageIndex;
            }
          }
        }
      });

      setLastMessageIndexReadByParticipants(messageIndex);
    };

    const onParticipantUpdated = ({
      participant,
      updateReasons,
    }: {
      participant: Participant;
      updateReasons: ParticipantUpdateReason[];
    }) => {
      if (
        client?.user.identity !== participant.identity &&
        updateReasons.includes("lastReadMessageIndex")
      ) {
        checkLastReadMessageIndex();
      }
    };

    conversation.on("participantUpdated", onParticipantUpdated);
    checkLastReadMessageIndex();

    return () => {
      conversation.off("participantUpdated", onParticipantUpdated);
    };
  }, [client?.user.identity, conversation]);

  return { lastMessageIndexReadByParticipants };
};
