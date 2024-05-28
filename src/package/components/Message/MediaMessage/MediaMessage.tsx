import { Media } from "@twilio/conversations";
import { useGetMediaMessageUrl } from "../useGetMediaMessageUrl";
import { Box, CircularProgress, Typography, styled } from "@mui/material";

interface Props {
  media: Media;
}

const Image = styled("img")({
  maxWidth: "100%",
  maxHeight: "200px",
  borderRadius: "10px",
  objectFit: "cover",
});

export const MediaMessage = ({ media }: Props) => {
  const { mediaUrl, isLoading, error } = useGetMediaMessageUrl(media);

  if (!mediaUrl) return null;

  if (error)
    return (
      <Typography variant="body2" color={"error"}>
        {error}
      </Typography>
    );

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "200px",
        width: "12em",
      }}
    >
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Image src={mediaUrl} alt={media.filename || "Media"} />
      )}
    </Box>
  );
};
