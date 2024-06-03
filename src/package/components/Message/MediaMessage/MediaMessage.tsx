import React from "react";
import { Media } from "@twilio/conversations";
import { useGetMediaMessageUrl } from "../useGetMediaMessageUrl";
import { Box, Skeleton, Typography, styled } from "@mui/material";

interface Props {
  media: Media;
  small?: boolean;
}

const Image = styled("img")<{ small?: boolean }>(({ small }) => ({
  maxWidth: "100%",
  maxHeight: small ? "100px" : "200px",
  borderRadius: "10px",
  objectFit: "cover",
}));

export const MediaMessage: React.FC<Props> = ({ media, small }) => {
  const { mediaUrl, isLoading, error } = useGetMediaMessageUrl(media);

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
        height: small ? "100px" : "200px",
        width: small ? "6em" : "12em",
      }}
    >
      {isLoading || !mediaUrl ? (
        <Skeleton
          animation="wave"
          variant="rectangular"
          width={"100%"}
          height={small ? "100px" : "200px"}
          sx={{ borderRadius: "10px" }}
        />
      ) : (
        <Image src={mediaUrl} alt={media.filename || "Media"} small={small} />
      )}
    </Box>
  );
};
