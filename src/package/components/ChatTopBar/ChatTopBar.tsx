import { useChat, useChatDispatch } from "@/package/context/Chat/context";
import { Avatar, Box, IconButton, Tooltip, Typography } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { useIsTyping } from "@/package/hooks";
import {
  Contact,
  ConversationAttributes,
  UserAttributes,
} from "@/package/types";
import { User } from "@twilio/conversations";
import PhoneIcon from "@mui/icons-material/Phone";
import { Badge } from "../Badge/Badge";

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
      <Box display={"flex"} gap={1}>
        {type === "individual" && (
          <IndividualConversation user={partyUsers![0]} isTyping={isTyping} />
        )}
      </Box>
      <span></span>
    </Box>
  );
};

const IndividualConversation = ({
  user,
  isTyping,
}: {
  user: User;
  isTyping: boolean;
}) => {
  const userAttributes = user.attributes as UserAttributes;
  const contact = Contact.buildContact({
    ...userAttributes.contact,
    status: user.isOnline ? "available" : "offline",
  });

  return (
    <Box display={"flex"} gap={1}>
      <Box position={"relative"}>
        <Avatar
          src={contact?.avatar || "/"}
          alt={contact?.label}
          sx={{
            width: 40,
            height: 40,
            border: "1px solid ",
          }}
        >
          {contact.type === "phone" && <PhoneIcon sx={{ fontSize: 40 }} />}
        </Avatar>
        <Tooltip
          title={
            <Typography variant={"body2"} fontSize={10}>
              {contact.status.label}
            </Typography>
          }
          placement="right"
        >
          <span>
            <Badge color={contact.status.color} size="small" />
          </span>
        </Tooltip>
      </Box>
      <Box display={"flex"} flexDirection={"column"} height={"100%"}>
        <Typography variant={"body1"} key={contact.identity}>
          {contact.label}
        </Typography>
        <Typography variant={"body2"}>{isTyping && "is typing..."}</Typography>
      </Box>
    </Box>
  );
};
