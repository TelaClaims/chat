import { useChat, useChatDispatch } from "@/package/context/Chat/context";
import { useSideBar } from "@/package/context/SideBarPanel/context";
import { Box, List, ListItemButton, Typography } from "@mui/material";
import { Conversation } from "@twilio/conversations";

export const ConversationsPanel = () => {
  const { conversations, client } = useChat();
  const { selectContact } = useChatDispatch();
  const { closeSideBar } = useSideBar();

  const handleClickConversation = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    conversation: Conversation
  ) => {
    event.preventDefault();
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

  if (client?.connectionState !== "connected") {
    return (
      <Box>
        <Typography variant={"body1"}>Can't load conversations.</Typography>
      </Box>
    );
  }

  return (
    <List>
      {conversations.map((conversation) => {
        const { sid } = conversation;
        const partyParticipants = Array.from(
          conversation._participants.values()
        ).filter(
          (participant) => participant.identity !== client?.user?.identity
        );

        return (
          <ListItemButton
            key={sid}
            onClick={(e) => handleClickConversation(e, conversation)}
          >
            <Typography variant={"body2"}>
              {partyParticipants.map((participant) => participant.identity)}
            </Typography>
          </ListItemButton>
        );
      })}
    </List>
  );
};
