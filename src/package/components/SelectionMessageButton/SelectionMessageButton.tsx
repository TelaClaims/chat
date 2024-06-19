import { useChat, useChatDispatch } from "@/package/context/Chat/context";
import { IconButton } from "@mui/material";
import { Message } from "@twilio/conversations";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

interface Props {
  message: Message;
}

export const SelectionMessageButton = ({ message }: Props) => {
  const { selectionMode } = useChat();
  const { setSelectionMode, getBulkMessages } = useChatDispatch();

  const addSelectedMessage = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    isMessageSelected: boolean
  ) => {
    event.preventDefault();
    let selectedMessages = [...selectionMode.selectedMessages];

    if (!isMessageSelected) {
      // bulk selection
      if (event.shiftKey && selectedMessages.length > 0) {
        const messageToSelect = message;

        const selectedFirstIndex = selectedMessages[0].index;
        const selectedLastIndex =
          selectedMessages[selectedMessages.length - 1].index;

        const fromIndex = Math.min(
          messageToSelect.index,
          selectedFirstIndex,
          selectedLastIndex
        );
        const toIndex = Math.max(
          messageToSelect.index,
          selectedFirstIndex,
          selectedLastIndex
        );

        selectedMessages = await getBulkMessages(
          messageToSelect.conversation,
          fromIndex,
          toIndex
        );
      } else {
        selectedMessages = [...selectedMessages, message];
      }
    } else {
      selectedMessages = selectedMessages.filter(
        (selectedMessage) => selectedMessage.sid !== message.sid
      );
    }

    setSelectionMode({
      ...selectionMode,
      selectedMessages,
    });
  };

  const isMessageSelected = selectionMode.selectedMessages.some(
    (selectedMessage) => selectedMessage.sid === message.sid
  );

  return (
    <IconButton
      size="small"
      onClick={(e) => addSelectedMessage(e, isMessageSelected)}
    >
      {isMessageSelected ? (
        <CheckCircleIcon fontSize="small" color="primary" />
      ) : (
        <RadioButtonUncheckedIcon fontSize="small" />
      )}
    </IconButton>
  );
};
