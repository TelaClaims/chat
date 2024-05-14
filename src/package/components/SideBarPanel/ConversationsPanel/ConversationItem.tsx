import { useIsTyping, useOnUpdateNewMessagesCount } from "@/package/hooks";
import { Badge, Box, ListItemButton, Typography } from "@mui/material";
import { Conversation } from "@twilio/conversations";

interface Props {
  conversation: Conversation;
  onSelectConversation: (conversation: Conversation) => void;
}

export const ConversationItem = ({
  conversation,
  onSelectConversation,
}: Props) => {
  const { participant, isTyping } = useIsTyping(conversation);
  const { newMessagesCount } = useOnUpdateNewMessagesCount(conversation);

  const handleClickConversation = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
    onSelectConversation(conversation);
  };

  return (
    <ListItemButton
      onClick={handleClickConversation}
      sx={{ display: "flex", justifyContent: "space-between" }}
    >
      <Typography variant={"body2"}>
        {/* {partyParticipants.map((participant) => participant.identity)} */}
        {conversation.uniqueName}
      </Typography>
      <Typography variant={"body2"}>
        {isTyping ? `${participant?.identity} is typing...` : ""}
      </Typography>
      {newMessagesCount > 0 && (
        <Box display={"flex"} alignItems={"center"} gap={2}>
          <Typography variant={"caption"}>New messages</Typography>
          <Badge badgeContent={newMessagesCount} color="primary" />
        </Box>
      )}
    </ListItemButton>
  );
};
