import { Conversation, Participant } from "@twilio/conversations";
import { useEffect, useState } from "react";

export const useIsTyping = (conversation?: Conversation) => {
  const [participant, setParticipant] = useState<Participant>();
  const [isTyping, setIsTyping] = useState<boolean>(false);

  useEffect(() => {
    const handleTypingStarted = (participant: Participant) => {
      setParticipant(participant);
      setIsTyping(true);
    };

    const handleTypingEnded = (participant: Participant) => {
      setParticipant(participant);
      setIsTyping(false);
    };

    if (!conversation) {
      return;
    }

    conversation.on("typingStarted", handleTypingStarted);
    conversation.on("typingEnded", handleTypingEnded);

    return () => {
      conversation.off("typingStarted", handleTypingStarted);
      conversation.off("typingEnded", handleTypingEnded);
    };
  }, [conversation]);

  return { participant, isTyping };
};
