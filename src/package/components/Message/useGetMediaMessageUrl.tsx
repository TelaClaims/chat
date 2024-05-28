import { Media } from "@twilio/conversations";
import { useEffect, useState } from "react";

export const useGetMediaMessageUrl = (media: Media) => {
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>();

  useEffect(() => {
    let isMounted = true;

    const fetchTemporaryMediaUrl = async () => {
      try {
        const url = await media.getContentTemporaryUrl();
        if (isMounted) {
          setMediaUrl(url);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError("Failed to fetch media");
          setIsLoading(false);
        }
      }
    };

    fetchTemporaryMediaUrl();

    return () => {
      isMounted = false;
    };
  }, [media]);

  return { mediaUrl, isLoading, error };
};
