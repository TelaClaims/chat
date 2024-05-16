import { Box } from "@mui/material";

interface Props {
  color: string;
  size: "small" | "medium" | "large";
}

const SIZES = {
  small: {
    width: "0.7rem",
    height: "0.7rem",
    right: "0",
    bottom: "0",
  },
  medium: {
    width: "1rem",
    height: "1rem",
    right: "5px",
    bottom: "5px",
  },
  large: {
    width: "1.5rem",
    height: "1.5rem",
    right: "6px",
    bottom: "6px",
  },
};

export const Badge = ({ color, size }: Props) => {
  return (
    <Box
      sx={{
        width: SIZES[size].width,
        height: SIZES[size].height,
        backgroundColor: color,
        borderRadius: "50%",
        position: "absolute",
        right: SIZES[size].right,
        bottom: SIZES[size].bottom,
        boxShadow: "0 0 0 2px #fff",
      }}
    />
  );
};
