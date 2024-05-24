import { useChat, useChatDispatch } from "@/package/context/Chat/context";
import { Box, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { useIsTyping } from "@/package/hooks";
import { ConversationAttributes } from "@/package/types";
import { IndividualConversation } from "../IndividualConversation/IndividualConversation";

export const ChatTopBar = () => {
  const { activeConversation } = useChat();
  const { conversation, partyUsers } = activeConversation || {};
  const { clearSelectedContact, setView } = useChatDispatch();
  const { isTyping } = useIsTyping(conversation);

  const conversationAttributes =
    conversation?.attributes as ConversationAttributes;
  const { type } = conversationAttributes;

  const handleCloseChat = () => {
    clearSelectedContact();
    setView("active");
  };

  return (
    <Box
      display={"flex"}
      justifyContent={"space-between"}
      alignItems={"center"}
      width={"100%"}
      p={1}
      borderBottom={"1px solid #ccc"}
    >
      <IconButton onClick={handleCloseChat}>
        <ChevronLeftIcon />
      </IconButton>
      {type === "individual" && (
        <IndividualConversation user={partyUsers![0]} isTyping={isTyping} />
      )}
      <span></span>
    </Box>
  );
};
