import CloseIcon from "@mui/icons-material/Close";
import { ActionButton, ContactUI } from "@/package/components";
import { useChat, useChatDispatch } from "@/package/context/Chat/context";
import { Stack } from "@/package/layouts/Stack";
import AddCommentIcon from "@mui/icons-material/AddComment";

const ContactView = () => {
  const { contactSelected } = useChat();
  const { setView, clearSelectedContact, startConversation } =
    useChatDispatch();

  const handleStartConversation = async () => {
    if (!contactSelected) {
      return;
    }

    await startConversation(contactSelected);
  };

  if (!contactSelected) return null;

  return (
    <Stack>
      <Stack.Segment
        flex={0.7}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <ContactUI
          contact={contactSelected}
          // onRenderContact={onRenderContact}
        />
      </Stack.Segment>
      <Stack.Segment
        flex={0.3}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"baseline"}
        gap={5}
      >
        <ActionButton
          color="primary"
          onClick={() => {
            setView("active");
            clearSelectedContact();
          }}
          icon={<CloseIcon fontSize="large" />}
        />
        <ActionButton
          active
          color="success"
          onClick={handleStartConversation}
          icon={<AddCommentIcon fontSize="large" />}
        />
      </Stack.Segment>
    </Stack>
  );
};
export default ContactView;
