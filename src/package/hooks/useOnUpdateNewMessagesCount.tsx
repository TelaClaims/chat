import {
  Conversation,
  ConversationUpdateReason,
  Message,
} from "@twilio/conversations";
import { useEffect, useState } from "react";
import { useChat } from "../context/Chat/context";

export const useOnUpdateNewMessagesCount = (conversation: Conversation) => {
  const { client } = useChat();
  const [newMessagesCount, setNewMessagesCount] = useState(0);

  useEffect(() => {
    const getNewMessagesCount = () => {
      const {
        lastMessage: lastConversationMessage,
        lastReadMessageIndex: lastMessageReadByUserIndex,
      } = conversation || {};

      const newMessagesCount =
        lastConversationMessage?.index !== undefined &&
        lastMessageReadByUserIndex !== null
          ? lastConversationMessage.index - lastMessageReadByUserIndex
          : 0;

      return newMessagesCount;
    };

    const checkNewMessageAdded = (message: Message) => {
      if (message.author !== client?.user.identity) {
        setNewMessagesCount((prevCount) => prevCount + 1);
      }
    };

    const checkUpdatedLastMessageRead = ({
      updateReasons,
    }: {
      conversation: Conversation;
      updateReasons: ConversationUpdateReason[];
    }) => {
      if (updateReasons.includes("lastReadMessageIndex")) {
        const newMessagesCount = getNewMessagesCount();
        setNewMessagesCount(newMessagesCount);
      }
    };

    conversation.on("messageAdded", checkNewMessageAdded);
    conversation.on("updated", checkUpdatedLastMessageRead);

    const newMessagesCount = getNewMessagesCount();
    setNewMessagesCount(newMessagesCount);

    return () => {
      conversation.off("messageAdded", checkNewMessageAdded);
      conversation.off("updated", checkUpdatedLastMessageRead);
    };
  }, [client?.user.identity, conversation]);

  return { newMessagesCount };
};
