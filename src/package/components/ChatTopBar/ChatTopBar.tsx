import { useChat, useChatDispatch } from "@/package/context/Chat/context";
import { Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useIsTyping } from "@/package/hooks";
import { ConversationAttributes } from "@/package/types";
import { IndividualConversation } from "../IndividualConversation/IndividualConversation";
import { Search } from "../Search/Search";
import SearchIcon from "@mui/icons-material/Search";

export const ChatTopBar = () => {
  const { activeConversation, search } = useChat();
  const { conversation, partyUsers } = activeConversation || {};
  const { clearSelectedContact, setView, setSearch } = useChatDispatch();
  const { isTyping } = useIsTyping(conversation);

  const conversationAttributes =
    conversation?.attributes as ConversationAttributes;
  const { type } = conversationAttributes;

  const handleCloseChat = () => {
    clearSelectedContact();
    setView("active");
  };

  const handleClickSearch = () => {
    if (!search.active) {
      setSearch({
        active: true,
      });
    }
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
      {search.active ? (
        <Search />
      ) : (
        <>
          <IconButton onClick={handleCloseChat}>
            <CloseIcon fontSize="small" />
          </IconButton>
          {type === "individual" && (
            <IndividualConversation
              user={partyUsers![0]}
              isTyping={isTyping}
              fullDisplay
            />
          )}
          <IconButton onClick={handleClickSearch}>
            <SearchIcon />
          </IconButton>
        </>
      )}
    </Box>
  );
};
