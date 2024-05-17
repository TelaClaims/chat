import { useEffect, useState } from "react";
import { useChat } from "../context/Chat/context";

export const useScrollToLastReadMessage = (messagesEl: {
  [key: string]: HTMLDivElement | null;
}) => {
  const { activeConversation } = useChat();
  const conversation = activeConversation?.conversation;
  const [lastReadMessageElement, setLastReadMessageElement] =
    useState<HTMLDivElement | null>();

  const scrollToLastReadMessage = () => {
    if (lastReadMessageElement) {
      lastReadMessageElement.scrollIntoView({
        block: "end",
        behavior: "auto",
      });
    }
  };

  useEffect(() => {
    // effect to scroll to the last read message
    if (conversation && messagesEl) {
      const lastReadMessageIndex = conversation.lastReadMessageIndex || 0;
      const messagesElements = Object.values(messagesEl);

      if (lastReadMessageIndex && messagesElements.length) {
        // get the last message element that has the same index as the last read message index
        const lastElementToScrollTo = messagesElements.find((element) => {
          const index = element?.getAttribute("data-index");
          return index && parseInt(index) === lastReadMessageIndex;
        });

        if (lastElementToScrollTo) {
          setLastReadMessageElement(lastElementToScrollTo);
        }
      }
    }
  }, [conversation, messagesEl]);

  return { scrollToLastReadMessage, lastReadMessageElement };
};
