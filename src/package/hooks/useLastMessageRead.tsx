import {
  Conversation,
  Message,
  Participant,
  ParticipantUpdateReason,
} from "@twilio/conversations";
import { useEffect, useState } from "react";
import { useChat } from "../context/Chat/context";

export const useLastMessageRead = (
  conversation: Conversation,
  messages: Message[]
) => {
  const { client } = useChat();
  const [lastMessageReadByParticipants, setLastMessageReadByParticipants] =
    useState<{ index: number; message: Message | null }>({
      index: -1,
      message: null,
    });

  // ! Not used anymore
  // const [lastMessageReadByClient, setLastMessageReadByClient] = useState<{
  //   index: number;
  //   message: Message | null;
  // }>({
  //   index: 0,
  //   message: null,
  // });

  useEffect(() => {
    const checkLastReadMessageIndexByParticipants = () => {
      const partyParticipants = Array.from(
        conversation._participants.values()
      ).filter((participant) => participant.identity !== client?.user.identity);

      let messageIndex = -1;

      partyParticipants.forEach((participant) => {
        console.log(participant.lastReadMessageIndex);
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

      const message = messages.find(
        (message) => message.index === messageIndex
      );

      if (message) {
        setLastMessageReadByParticipants({
          index: messageIndex,
          message: messages[messageIndex],
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

    conversation.on("participantUpdated", onParticipantUpdated);
    checkLastReadMessageIndexByParticipants();

    return () => {
      conversation.off("participantUpdated", onParticipantUpdated);
    };
  }, [client?.user.identity, conversation, messages]);

  // useEffect(() => {
  //   if (messages && conversation.lastReadMessageIndex) {
  //     const message = messages.find(
  //       (message) => message.index === conversation.lastReadMessageIndex
  //     );

  //     if (message) {
  //       setLastMessageReadByClient({
  //         index: conversation.lastReadMessageIndex,
  //         message,
  //       });
  //     }
  //   }
  // }, [conversation.lastReadMessageIndex, messages]);

  return {
    lastMessageReadByParticipants,
    // lastMessageReadByClient
  };
};
