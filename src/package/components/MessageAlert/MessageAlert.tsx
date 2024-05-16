import { Alert, AlertColor, Box } from "@mui/material";
interface Props {
  show?: boolean;
  text: string;
  color: AlertColor;
  onClickAlert?: () => void;
}

export const MessageAlert = ({ show, text, color, onClickAlert }: Props) => {
  return (
    <Box
      position={"absolute"}
      width={"100%"}
      display={"flex"}
      justifyContent={"center"}
      bottom={0}
    >
      <Alert
        onClick={onClickAlert}
        variant="filled"
        severity={color}
        icon={false}
        sx={{
          transform: show ? "translateY(-200%)" : "translateY(0%)",
          transition: "transform 0.2s cubic-bezier(0.42, 0, 1, 1)",
          transitionDelay: "0.5s",
          py: 0,
          cursor: "pointer",
        }}
      >
        {text}
      </Alert>
    </Box>
  );
};
