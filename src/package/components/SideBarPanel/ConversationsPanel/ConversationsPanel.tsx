import { useChat, useChatDispatch } from "@/package/context/Chat/context";
import { useSideBar } from "@/package/context/SideBarPanel/context";
import { List } from "@mui/material";
import {
  Conversation,
  ConversationBindings,
  ParticipantType,
} from "@twilio/conversations";
import { ConversationItem } from "./ConversationItem";
import { ContactInput } from "@/package/types";

export const ConversationsPanel = () => {
  const { conversations, client } = useChat();
  const { selectContact } = useChatDispatch();
  const { closeSideBar } = useSideBar();

  const handleClickConversation = (conversation: Conversation) => {
    const partyParticipants = Array.from(
      conversation._participants.values()
    ).filter((participant) => participant.identity !== client?.user?.identity);

    if (partyParticipants.length === 1) {
      let partyContact: ContactInput;
      const participantType = partyParticipants[0].type as ParticipantType;
      const participantBindings = partyParticipants[0]
        .bindings as ConversationBindings;

      if (participantType === "sms") {
        partyContact = {
          identity: participantBindings.sms?.address || "",
          label: participantBindings.sms?.address || "",
          type: "phone",
        };
      } else {
        partyContact = {
          identity: partyParticipants[0].identity!,
          label: partyParticipants[0].identity!,
          type: "identifier",
        };
      }
      selectContact(partyContact, "on-chat");
      closeSideBar();
    }
  };

  return (
    <List>
      {conversations.map((conversation) => {
        // const partyParticipants = Array.from(
        //   conversation._participants.values()
        // ).filter(
        //   (participant) => participant.identity !== client?.user?.identity
        // );
        return (
          <ConversationItem
            key={conversation.sid}
            conversation={conversation}
            onSelectConversation={handleClickConversation}
          />
        );
      })}
    </List>
  );
};
