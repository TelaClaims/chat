import { User, UserUpdateReason } from "@twilio/conversations";
import { useEffect } from "react";
import { useChat } from "../context/Chat/context";

export const useUserStatusChange = () => {
  const { client } = useChat();

  useEffect(() => {
    const onUserUpdated = ({
      user,
      updateReasons,
    }: {
      user: User;
      updateReasons: UserUpdateReason[];
    }) => {
      console.log({ user, updateReasons });
    };

    client?.on("userUpdated", onUserUpdated);

    return () => {
      client?.off("userUpdated", onUserUpdated);
    };
  }, [client]);
};
