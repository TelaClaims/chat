import { Message, MessageUpdateReason } from "@twilio/conversations";
import { useEffect, useState } from "react";

interface Props {
  message: Message;
}

export const useOnMessageUpdated = ({ message }: Props) => {
  const [updatedMessageBy, setUpdatedMessageBy] = useState("");

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
    };

    message.on("updated", checkMessageUpdate);

    if (message.lastUpdatedBy) {
      setUpdatedMessageBy(message.lastUpdatedBy);
    }

    return () => {
      message.off("updated", checkMessageUpdate);
    };
  }, [message]);

  return { updatedMessageBy };
};
