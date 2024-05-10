import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box } from "@mui/material";
import { useChatDispatch } from "@/package/context/Chat/context";
import { Contact, Handlers } from "@/package/types";
import { Stack } from "@/package/layouts/Stack";
import { ActionButton, LookupInput } from "@/package/components";

interface Props {
  onLookupContact?: Handlers["onLookupContact"];
}

const LookupView = ({ onLookupContact }: Props) => {
  const { selectContact, setView } = useChatDispatch();

  const onSelectContact = (contact: Contact) => {
    selectContact(contact);
  };

  return (
    <Stack>
      <Stack.Segment
        flex={0.7}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Box width={"100%"} mx={4}>
          <LookupInput
            onLookupContact={onLookupContact}
            onSelectContact={onSelectContact}
          />
        </Box>
      </Stack.Segment>
      <Stack.Segment flex={0.3}>
        <ActionButton
          color="primary"
          onClick={() => setView("active")}
          icon={<ArrowBackIcon fontSize="large" />}
        />
      </Stack.Segment>
    </Stack>
  );
};

export default LookupView;
