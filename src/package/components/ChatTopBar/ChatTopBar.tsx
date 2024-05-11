import { useChat, useChatDispatch } from "@/package/context/Chat/context";
import { Avatar, Box, IconButton, Typography } from "@mui/material";
import { Conversation, Participant } from "@twilio/conversations";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { useIsTyping } from "@/package/hooks";

interface Props {
  conversation: Conversation;
  participants: Participant[];
}

export const ChatTopBar = ({ conversation, participants }: Props) => {
  const { contactSelected } = useChat();
  const { clearSelectedContact, setView } = useChatDispatch();
  const { participant: typingParticipant, isTyping } =
    useIsTyping(conversation);

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
    >
      <IconButton onClick={handleCloseChat}>
        <ChevronLeftIcon />
      </IconButton>
      <Box display={"flex"} gap={1}>
        <Avatar
          alt={contactSelected?.label}
          src={contactSelected?.avatar || "/"}
        />
        <Box display={"flex"} flexDirection={"column"} height={"100%"}>
          {participants?.map((participant) => {
            return (
              <Box key={participant.sid}>
                <Typography variant={"body1"} key={participant.identity}>
                  {participant.identity}
                </Typography>
                <Typography variant={"body2"}>
                  {isTyping &&
                    typingParticipant?.identity === participant.identity &&
                    "is typing..."}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};
