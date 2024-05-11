import { useChat } from "@/package/context/Chat/context";
import { Stack } from "@/package/layouts/Stack";
import {
  Box,
  IconButton,
  InputAdornment,
  List,
  TextField,
  Typography,
  colors,
} from "@mui/material";
import { useRef } from "react";
import SendIcon from "@mui/icons-material/Send";
import { ChatTopBar, MessageUI } from "@/package/components";

const ChatView = () => {
  const { activeConversation } = useChat();
  const { conversation, messages, partyParticipants } =
    activeConversation || {};

  const messageInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = async () => {
    const cleanMessage = messageInputRef.current?.value?.trim();
    if (cleanMessage && conversation) {
      // activeConversation?.conversation.sendMessage(cleanMessage);
      await activeConversation?.conversation
        .prepareMessage()
        .setBody(cleanMessage)
        .buildAndSend();
      messageInputRef.current!.value = "";
    }
  };

  const handleTyping = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSendMessage();
    } else {
      activeConversation?.conversation.typing();
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
        <ChatTopBar
          conversation={conversation!}
          participants={partyParticipants!}
        />
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
            <MessageUI
              key={message.sid}
              message={message}
              partyParticipants={partyParticipants}
            />
          ))}
          {messages?.length === 0 && (
            <Box display={"flex"} justifyContent={"center"} p={2}>
              <Typography variant={"body1"}>No messages yet.</Typography>
            </Box>
          )}
        </List>
      </Stack.Segment>

      {/* Chat Input Tools */}
      <Stack.Segment flex={0.1} pt={1} bgcolor={colors.grey["100"]}>
        <TextField
          inputRef={messageInputRef}
          label="Type a message"
          name="message"
          variant="outlined"
          defaultValue={""}
          fullWidth
          InputProps={{
            onKeyDown: handleTyping,
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
