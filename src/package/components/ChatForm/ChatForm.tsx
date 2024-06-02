import { Box, IconButton, InputAdornment, TextField } from "@mui/material";
import { colors } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useEffect, useRef } from "react";
import { useChat, useChatDispatch } from "@/package/context/Chat/context";
import { MessageSelectedPlaceHolder } from "../MessageSelectedPlaceHolder/MessageSelectedPlaceHolder";
import { SendMediaButton } from "../SendMediaButton/SendMediaButton";

interface Props {
  goToLastMessage: () => void;
}

export const ChatForm = ({ goToLastMessage }: Props) => {
  const { activeConversation, selectedMessage } = useChat();
  const { selectMessage, setAlert } = useChatDispatch();
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

  const handleSendMediaMessage = async (file: File) => {
    try {
      const fileBlob = await file.arrayBuffer();

      const sendMediaOptions = {
        contentType: file.type,
        filename: file.name,
        media: new Blob([fileBlob]),
      };

      await activeConversation?.conversation
        .prepareMessage()
        .addMedia(sendMediaOptions)
        .buildAndSend();

      await activeConversation?.conversation.setAllMessagesRead();
      goToLastMessage();
    } catch (error) {
      setAlert({
        type: "error",
        message: "Failed to send media",
      });
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
      <Box display={"flex"}>
        <SendMediaButton onSelectedFile={handleSendMediaMessage} />
        <TextField
          sx={{
            zIndex: 2,
            bgcolor: colors.grey["100"],

            "& .MuiInputLabel-shrink": {
              transform: "translate(14px, -3px) scale(0.75)", // Ajusta la posición cuando está shrink
            },
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
      </Box>
    </>
  );
};
