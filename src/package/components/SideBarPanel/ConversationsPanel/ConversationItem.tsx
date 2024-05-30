import { useOnUpdateNewMessagesCount } from "@/package/hooks";
import { Conversation } from "@/package/types";
import { Badge, Box, ListItemButton, Typography } from "@mui/material";
import { IndividualConversation } from "../../IndividualConversation/IndividualConversation";
import { useSideBar } from "@/package/context/SideBarPanel/context";

interface Props {
  conversation: Conversation;
  onSelectConversation: (conversation: Conversation) => void;
}

export const ConversationItem = ({
  conversation,
  onSelectConversation,
}: Props) => {
  const { open } = useSideBar();

  const { conversation: twilioConversation, type, partyUsers } = conversation;

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
      sx={{
        display: "flex",
        justifyContent: open ? "space-between" : "center",
        overflow: "hidden",
      }}
    >
      {type === "individual" && (
        <>
          <IndividualConversation
            user={partyUsers[0]}
            fullDisplay={open}
            newMessagesCount={open ? 0 : newMessagesCount}
          />
          {open && (
            <>
              {newMessagesCount > 0 && (
                <Box display={"flex"} alignItems={"center"} gap={2}>
                  <Badge badgeContent={newMessagesCount} color="primary" />
                </Box>
              )}
            </>
          )}
        </>
      )}
      {type === "group" && (
        <>
          <Typography variant={"body2"}>
            {twilioConversation.uniqueName}
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
