import { IconButton, InputAdornment, TextField } from "@mui/material";
import { colors } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useEffect, useRef } from "react";
import { useChat, useChatDispatch } from "@/package/context/Chat/context";
import { MessageSelectedPlaceHolder } from "../MessageSelectedPlaceHolder/MessageSelectedPlaceHolder";

interface Props {
  goToLastMessage: () => void;
}

export const ChatForm = ({ goToLastMessage }: Props) => {
  const { activeConversation, selectedMessage } = useChat();
  const { selectMessage } = useChatDispatch();
  const { conversation } = activeConversation || {};
  const messageInputRef = useRef<HTMLInputElement>(null);

  const handleTyping = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSendMessage();
    } else {
      activeConversation?.conversation.typing();
    }
  };

  const handleSendMessage = async () => {
    const cleanMessage = messageInputRef.current?.value?.trim();
    if (cleanMessage && conversation) {
      if (selectedMessage) {
        const { message, reason } = selectedMessage;
        if (message && reason === "edit") {
          await message.updateBody(cleanMessage);
          selectMessage();
        }
        return;
      }

      // activeConversation?.conversation.sendMessage(cleanMessage);
      await activeConversation?.conversation
        .prepareMessage()
        .setBody(cleanMessage)
        .buildAndSend();
      messageInputRef.current!.value = "";

      await conversation.setAllMessagesRead();
      goToLastMessage();
    }
  };

  useEffect(() => {
    if (selectedMessage) {
      const { message, reason } = selectedMessage;
      if (reason === "edit") {
        messageInputRef.current!.value = message.body || "";
        messageInputRef.current!.focus();
      }
    } else {
      messageInputRef.current!.value = "";
    }
  }, [selectedMessage]);

  return (
    <>
      {selectedMessage && (
        <MessageSelectedPlaceHolder
          message={selectedMessage.message}
          onClose={selectMessage}
        />
      )}
      <TextField
        sx={{
          zIndex: 2,
          bgcolor: colors.grey["100"],
        }}
        inputRef={messageInputRef}
        label="Type a message"
        name="message"
        variant="outlined"
        defaultValue={""}
        fullWidth
        InputLabelProps={{ shrink: true }}
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
    </>
  );
};
