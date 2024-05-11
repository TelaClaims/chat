import { useChat, useChatDispatch } from "@/package/context/Chat/context";
import { useSideBar } from "@/package/context/SideBarPanel/context";
import { List } from "@mui/material";
import { Conversation } from "@twilio/conversations";
import { ConversationItem } from "./ConversationItem";

export const ConversationsPanel = () => {
  const { conversations, client } = useChat();
  const { selectContact } = useChatDispatch();
  const { closeSideBar } = useSideBar();

  const handleClickConversation = (conversation: Conversation) => {
    const partyParticipants = Array.from(
      conversation._participants.values()
    ).filter((participant) => participant.identity !== client?.user?.identity);

    if (partyParticipants.length === 1) {
      selectContact(
        {
          identity: partyParticipants[0].identity!,
          label: partyParticipants[0].identity!,
        },
        "on-chat"
      );
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
