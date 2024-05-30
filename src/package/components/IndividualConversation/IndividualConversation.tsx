import { getContact } from "@/package/utils";
import { Avatar, Box, Tooltip, Typography, colors } from "@mui/material";
import { User } from "@twilio/conversations";
import { Badge } from "../Badge/Badge";
import PhoneIcon from "@mui/icons-material/Phone";

export const IndividualConversation = ({
  user,
  isTyping,
  fullDisplay,
  newMessagesCount = 0,
}: {
  user: User;
  isTyping?: boolean;
  fullDisplay?: boolean;
  newMessagesCount?: number;
}) => {
  const contact = getContact(user);
  contact.setStatus(user.isOnline ? "available" : "offline");

  return (
    <Box display={"flex"} gap={1} alignItems={"center"}>
      <Box position={"relative"}>
        <Tooltip title={contact.label} placement="left">
          <Avatar
            src={contact?.avatar || "/"}
            alt={contact?.label}
            sx={{
              width: 40,
              height: 40,
              border: "1px solid",
            }}
          >
            {contact.type === "phone" && <PhoneIcon sx={{ fontSize: 40 }} />}
          </Avatar>
        </Tooltip>
        <Tooltip
          title={
            <Typography variant={"body2"} fontSize={10}>
              {contact.status.label}
            </Typography>
          }
          placement="right"
        >
          <span>
            <Badge
              color={contact.status.color}
              size="small"
              position={{
                right: true,
                bottom: true,
              }}
            />
          </span>
        </Tooltip>
        {newMessagesCount > 0 && (
          <Badge
            color={colors.blue[700]}
            size="medium"
            position={{
              right: true,
              top: true,
            }}
            content={`${newMessagesCount}`}
          />
        )}
      </Box>
      {fullDisplay && (
        <Box display={"flex"} flexDirection={"column"} height={"100%"}>
          <Typography variant={"body1"} key={contact.identity}>
            {contact.label}
          </Typography>
          <Typography variant={"body2"}>
            {isTyping && "is typing..."}
          </Typography>
        </Box>
      )}
    </Box>
  );
};
