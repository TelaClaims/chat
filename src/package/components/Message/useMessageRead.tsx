import { Message } from "@twilio/conversations";
import { useEffect } from "react";

interface Props {
  message: Message;
  ref: React.RefObject<HTMLLIElement>;
}

export const useMessageRead = ({ message, ref }: Props) => {
  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const messageElement = ref.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const lastReadMessageIndex =
            message.conversation?.lastReadMessageIndex;

          if (!lastReadMessageIndex || lastReadMessageIndex < message.index) {
            message.conversation.updateLastReadMessageIndex(message.index);
          }
        }
      },
      {
        root: null,
        threshold: 0.8,
      }
    );

    observer.observe(messageElement);

    return () => {
      observer.unobserve(messageElement);
    };
  }, [ref, message]);
};
