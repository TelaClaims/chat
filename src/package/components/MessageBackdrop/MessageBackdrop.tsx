import { Box, CircularProgress } from "@mui/material";

interface Props {
  show?: boolean;
  displayLoading?: boolean;
  onClick: () => void;
  children?: React.ReactNode;
}

export const MessageBackdrop = ({
  show,
  displayLoading,
  onClick,
  children,
}: Props) => {
  if (!show) return null;

  return (
    <Box
      onClick={onClick}
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
        backdropFilter: "blur(3px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {displayLoading && <CircularProgress color="primary" size={60} />}
      {children}
    </Box>
  );
};
