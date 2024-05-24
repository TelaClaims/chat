import { useIsTyping, useOnUpdateNewMessagesCount } from "@/package/hooks";
import { Conversation } from "@/package/types";
import { Badge, Box, ListItemButton, Typography } from "@mui/material";
import { IndividualConversation } from "../../IndividualConversation/IndividualConversation";

interface Props {
  conversation: Conversation;
  onSelectConversation: (conversation: Conversation) => void;
}

export const ConversationItem = ({
  conversation,
  onSelectConversation,
}: Props) => {
  const { conversation: twilioConversation, type, partyUsers } = conversation;

  const { participant, isTyping } = useIsTyping(twilioConversation);
  const { newMessagesCount } = useOnUpdateNewMessagesCount(twilioConversation);

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
      {type === "individual" && (
        <>
          <IndividualConversation user={partyUsers[0]} isTyping={isTyping} />
          {newMessagesCount > 0 && (
            <Box display={"flex"} alignItems={"center"} gap={2}>
              <Typography variant={"caption"}>New messages</Typography>
              <Badge badgeContent={newMessagesCount} color="primary" />
            </Box>
          )}
        </>
      )}
      {type === "group" && (
        <>
          <Typography variant={"body2"}>
            {twilioConversation.uniqueName}
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
        </>
      )}
    </ListItemButton>
  );
};
