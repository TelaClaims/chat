import { Box } from "@mui/material";

interface Props {
  color: string;
  size: "small" | "medium" | "large";
  position: {
    right?: boolean;
    left?: boolean;
    top?: boolean;
    bottom?: boolean;
  };
  content?: string;
}

const SIZES = {
  small: {
    width: "0.7rem",
    height: "0.7rem",
    right: "0",
    left: "0",
    top: "0",
    bottom: "0",
  },
  medium: {
    width: "1rem",
    height: "1rem",
    right: "0",
    left: "5px",
    top: "0",
    bottom: "5px",
  },
  large: {
    width: "1.5rem",
    height: "1.5rem",
    right: "6px",
    left: "6px",
    top: "6px",
    bottom: "6px",
  },
};

export const Badge = ({ color, size, position, content }: Props) => {
  const { right, left, top, bottom } = position;

  return (
    <Box
      sx={{
        width: SIZES[size].width,
        height: SIZES[size].height,
        backgroundColor: color,
        borderRadius: "50%",
        position: "absolute",
        right: right ? SIZES[size].right : "unset",
        bottom: bottom ? SIZES[size].bottom : "unset",
        left: left ? SIZES[size].left : "unset",
        top: top ? SIZES[size].top : "unset",
        boxShadow: "0 0 0 2px #fff",
      }}
    >
      {content && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "#fff",
            fontSize: "0.75rem",
          }}
        >
          {content}
        </Box>
      )}
    </Box>
  );
};
