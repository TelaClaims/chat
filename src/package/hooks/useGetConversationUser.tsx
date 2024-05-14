import { useEffect, useState } from "react";
import { useChat } from "../context/Chat/context";
import { User } from "@twilio/conversations";
import { log } from "../utils";

interface Props {
  identity: string;
}

export const useGetConversationUser = ({ identity }: Props) => {
  const { client } = useChat();
  const [conversationUser, setConversationUser] = useState<User>();

  useEffect(() => {
    if (!client || !identity) {
      throw new Error("Client or identity is missing");
    }

    client
      .getUser(identity)
      .then((user) => {
        setConversationUser(user);
      })
      .catch((error) => {
        log("error", error);
      });
  }, [client, identity]);

  return { conversationUser };
};
