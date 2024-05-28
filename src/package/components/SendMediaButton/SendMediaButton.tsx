import { Box, IconButton, colors, styled } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useRef } from "react";
import { useChatDispatch } from "@/package/context/Chat/context";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

interface Props {
  onSelectedFile: (file: File) => void;
}

export const SendMediaButton = ({ onSelectedFile }: Props) => {
  const { setAlert } = useChatDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClickSendMediaMessage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];

      if (file.type.startsWith("image/")) {
        onSelectedFile(files[0]);
      } else {
        setAlert({
          message: "Invalid file type. Please select an image file.",
          type: "error",
        });
      }
    }
  };

  return (
    <Box
      border={"1px solid #ccc"}
      sx={{
        bgcolor: colors.grey["100"],
        borderRight: "none",
        alignContent: "center",
      }}
    >
      <IconButton onClick={handleClickSendMediaMessage}>
        <AddIcon />
      </IconButton>
      <VisuallyHiddenInput
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
    </Box>
  );
};
