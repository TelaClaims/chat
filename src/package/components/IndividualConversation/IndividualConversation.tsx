import { getContact } from "@/package/utils";
import { Avatar, Box, Tooltip, Typography } from "@mui/material";
import { User } from "@twilio/conversations";
import { Badge } from "../Badge/Badge";
import PhoneIcon from "@mui/icons-material/Phone";

export const IndividualConversation = ({
  user,
  isTyping,
}: {
  user: User;
  isTyping: boolean;
}) => {
  const contact = getContact(user);

  return (
    <Box display={"flex"} gap={1} alignItems={"center"}>
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
