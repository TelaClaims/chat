import { useChat, useChatDispatch } from "@/package/context/Chat/context";
import { Stack } from "@/package/layouts/Stack";
import {
  Box,
  IconButton,
  InputAdornment,
  List,
  TextField,
  colors,
} from "@mui/material";
import { useRef } from "react";
import SendIcon from "@mui/icons-material/Send";
import { MessageUI } from "@/package/components";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

const ChatView = () => {
  const { activeConversation } = useChat();
  const { conversation, messages } = activeConversation || {};
  const messageRef = useRef<HTMLInputElement>(null);
  const { clearSelectedContact, setView } = useChatDispatch();

  const handleCloseChat = () => {
    clearSelectedContact();
    setView("active");
  };

  const handleSendMessage = () => {
    const cleanMessage = messageRef.current?.value?.trim();
    if (cleanMessage && conversation) {
      conversation.sendMessage(cleanMessage);
      messageRef.current!.value = "";
    }
  };

  return (
    <Stack>
      {/* Chat Top Bar */}
      <Stack.Segment
        flex={0.1}
        display={"flex"}
        width={"100%"}
        bgcolor={colors.grey["200"]}
      >
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
        </Box>
      </Stack.Segment>

      {/* Chat Messages  */}
      <Stack.Segment
        flex={0.8}
        display={"flex"}
        width={"100%"}
        overflow={"auto"}
      >
        <List sx={{ width: "100%" }}>
          {messages?.map((message) => (
            <MessageUI key={message.sid} message={message} />
          ))}
        </List>
      </Stack.Segment>

      {/* Chat Input Tools */}
      <Stack.Segment flex={0.2}>
        <TextField
          inputRef={messageRef}
          label="Type a message"
          name="message"
          variant="outlined"
          defaultValue={""}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSendMessage}>
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack.Segment>
    </Stack>
  );
};

export default ChatView;
