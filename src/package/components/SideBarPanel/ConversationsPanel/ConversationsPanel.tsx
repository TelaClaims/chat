import { useChat, useChatDispatch } from "@/package/context/Chat/context";
import { useSideBar } from "@/package/context/SideBarPanel/context";
import { List } from "@mui/material";
import { ConversationBindings, ParticipantType } from "@twilio/conversations";
import { ConversationItem } from "./ConversationItem";
import { ContactInput, Conversation } from "@/package/types";
import { getContact } from "@/package/utils";

export const ConversationsPanel = () => {
  const { conversations } = useChat();
  const { selectContact } = useChatDispatch();
  const { closeSideBar } = useSideBar();

  const handleClickConversation = (conversation: Conversation) => {
    const { partyParticipants, type, partyUsers } = conversation;

    if (type === "individual") {
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
        partyContact = getContact(partyUsers[0]);
      }
      selectContact(partyContact, "on-chat");
      closeSideBar();
    }
  };

  if (!conversations) return null;

  return (
    <List sx={{ maxHeight: "calc(100% - 74px)", overflowY: "auto" }}>
      {conversations.map((conversation) => {
        return (
          <ConversationItem
            key={conversation.conversation.sid}
            conversation={conversation}
            onSelectConversation={handleClickConversation}
          />
        );
      })}
    </List>
  );
};
