import { Box, IconButton, colors } from "@mui/material";
import { ArrowDownward as ArrowDownwardIcon } from "@mui/icons-material";

interface Props {
  show: boolean;
  onClick: () => void;
}

export const MessageAlertScrollToBottom = ({ show, onClick }: Props) => {
  return (
    <Box
      position={"absolute"}
      bottom={0}
      right={16}
      sx={{
        transform: show //lastMessageInViewPort
          ? "translateY(0%)"
          : "translateY(-200%)",
        transition: "all 0.2s cubic-bezier(0.42, 0, 1, 1)",
        transitionDelay: "0.5s",
        opacity: 0.5,
        ":hover": {
          opacity: 1,
        },
      }}
    >
      <IconButton
        onClick={onClick} //{goToLastMessage}
        color="info"
        sx={{
          bgcolor: colors.grey["200"],
        }}
      >
        <ArrowDownwardIcon />
      </IconButton>
    </Box>
  );
};
