import {
  Message,
  Participant,
  ParticipantUpdateReason,
} from "@twilio/conversations";
import { useEffect, useState } from "react";
import { useChat } from "../context/Chat/context";
import { ActiveConversation } from "../types";

export const useLastMessageRead = (conversation: ActiveConversation) => {
  const { client } = useChat();
  const [lastMessageReadByParticipants, setLastMessageReadByParticipants] =
    useState<{ index: number; message: Message | null }>({
      index: -1,
      message: null,
    });

  useEffect(() => {
    const checkLastReadMessageIndexByParticipants = () => {
      let messageIndex = -1;
      let readMessage: Message | undefined = undefined;

      conversation.partyParticipants.forEach((participant) => {
        if (participant.lastReadMessageIndex !== null) {
          if (messageIndex === -1) {
            messageIndex = participant.lastReadMessageIndex;
          } else {
            if (participant.lastReadMessageIndex < messageIndex) {
              messageIndex = participant.lastReadMessageIndex;
            }
          }
        }
      });

      if (
        messageIndex >
        conversation.messages[conversation.messages.length - 1]?.index
      ) {
        readMessage = conversation.messages[conversation.messages.length - 1];
      } else {
        readMessage = conversation.messages.find(
          (message) => message.index === messageIndex
        );
      }

      if (readMessage) {
        setLastMessageReadByParticipants({
          index: messageIndex,
          message: conversation.messages[messageIndex],
        });
      }
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
        checkLastReadMessageIndexByParticipants();
      }
    };

    conversation.conversation.on("participantUpdated", onParticipantUpdated);
    checkLastReadMessageIndexByParticipants();

    return () => {
      conversation.conversation.off("participantUpdated", onParticipantUpdated);
    };
  }, [client?.user.identity, conversation]);

  return {
    lastMessageReadByParticipants,
  };
};
