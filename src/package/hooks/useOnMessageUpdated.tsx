import { Message, MessageUpdateReason } from "@twilio/conversations";
import { useEffect, useState } from "react";
import { MessageAttributes } from "../types";

interface Props {
  message: Message;
}

export const useOnMessageUpdated = ({ message }: Props) => {
  const [updatedMessageBy, setUpdatedMessageBy] = useState("");
  const [updatedTags, setUpdatedTags] = useState<string[]>([]);

  useEffect(() => {
    const checkMessageUpdate = ({
      updateReasons,
    }: {
      message: Message;
      updateReasons: MessageUpdateReason[];
    }) => {
      if (updateReasons.includes("body") && message.lastUpdatedBy) {
        setUpdatedMessageBy(message.lastUpdatedBy);
      }

      if (updateReasons.includes("attributes")) {
        const messageAttributes = message.attributes as MessageAttributes;
        if (messageAttributes.tags) {
          setUpdatedTags(messageAttributes.tags);
        }
      }
    };

    message.on("updated", checkMessageUpdate);

    if (message.lastUpdatedBy) {
      setUpdatedMessageBy(message.lastUpdatedBy);
    }

    return () => {
      message.off("updated", checkMessageUpdate);
    };
  }, [message]);

  return { updatedMessageBy, updatedTags };
};
