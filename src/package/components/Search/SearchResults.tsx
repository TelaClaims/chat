import { useChat, useChatDispatch } from "@/package/context/Chat/context";
import {
  Box,
  Chip,
  CircularProgress,
  IconButton,
  List,
  ListItemButton,
  Typography,
  colors,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { MessageAttributes } from "@/package/types";
import { useInView } from "react-intersection-observer";
import { MediaMessage } from "../Message/MediaMessage/MediaMessage";
import { TextWithEmojis } from "@/package/utils";

export const SearchResults = () => {
  const { search, goingToMessage } = useChat();
  const {
    setSearch,
    goToMessage,
    searchMessages,
    getContactFromActiveConversation,
  } = useChatDispatch();
  const { results } = search;

  const handleCloseSearch = () => {
    setSearch({
      active: false,
    });
  };

  const handleClickMessageToSearch = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    messageIndex: number
  ) => {
    event.preventDefault();
    setSearch({
      active: false,
    });
    goToMessage(messageIndex);
  };

  const fetchMoreSearchResults = async () => {
    const currentQuery = search.query!;
    const currentItems = results?.items || [];

    const messagesPagination = await searchMessages({
      query: currentQuery,
      lastMessageIndex: currentItems[currentItems.length - 1].index,
    });
    setSearch({
      results: {
        items: [...currentItems, ...messagesPagination.items],
        hasMore: messagesPagination.hasMore,
      },
    });
  };

  const handleBottomMessageInViewPort = async (inView: boolean) => {
    if (inView && search.results?.hasMore) {
      fetchMoreSearchResults();
    }
  };

  const { ref: bottomSearchMessagesRef } = useInView({
    onChange: handleBottomMessageInViewPort,
  });

  const highlightText = (text: string, highlight: string) => {
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));

    return parts.map((part, index) => {
      const isHighlight = part.toLowerCase() === highlight.toLowerCase();

      return isHighlight ? (
        <Box component={"span"} key={index} sx={{ backgroundColor: "yellow" }}>
          <TextWithEmojis text={part} />
        </Box>
      ) : (
        <span key={`${index}-${part}`}>
          <TextWithEmojis text={part} />
        </span>
      );
    });
  };

  if (!search.active) return null;

  const totalResults = results?.items?.length || 0;

  return (
    <Box height={"75%"} width={"100%"} bgcolor={"transparent"}>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        {totalResults > 0 ? (
          <Typography ml={2} variant="body1">
            Found {totalResults} results
          </Typography>
        ) : (
          <span />
        )}
        <IconButton onClick={handleCloseSearch}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      <Box
        width={"100%"}
        height={"calc(100% - 26px)"}
        sx={{
          overflowY: "scroll",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {totalResults > 0 && (
          <>
            <List>
              {results?.items!.map((result) => {
                const resultAttributes = result.attributes as MessageAttributes;
                const tags = resultAttributes.tags;
                const hasMedia = result.attachedMedia?.[0];

                const authorContact = getContactFromActiveConversation(
                  result.author || ""
                );

                return (
                  <ListItemButton
                    key={result.sid}
                    sx={{
                      bgcolor:
                        result.index === goingToMessage?.index
                          ? "rgba(12, 12, 12, 0.407)"
                          : "rgba(12, 12, 12, 0.207);",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                    onClick={(e) => handleClickMessageToSearch(e, result.index)}
                  >
                    <Box
                      display={"flex"}
                      flexDirection={"column"}
                      width={"75%"}
                    >
                      <Typography variant="subtitle1" fontWeight="bold">
                        {authorContact.label}
                      </Typography>

                      {hasMedia && (
                        <MediaMessage media={result.attachedMedia![0]} small />
                      )}
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{
                          overflowWrap: "break-word",
                        }}
                      >
                        {/* make a highlight in the body world witch contain the query */}
                        {highlightText(result.body || "", search.query || "")}
                      </Typography>
                      <Box
                        display={"flex"}
                        flexWrap={"wrap"}
                        gap={0.5}
                        justifyContent={"flex-start"}
                      >
                        {tags?.map((tag) => (
                          <Chip
                            key={tag}
                            label={
                              <Typography
                                sx={{
                                  fontSize: 12,
                                  color:
                                    tag === search.query
                                      ? colors.common.black
                                      : colors.common.white,
                                  backgroundColor:
                                    tag === search.query
                                      ? colors.yellow[500]
                                      : "transparent",
                                }}
                              >
                                {tag}
                              </Typography>
                            }
                            size="small"
                            variant="filled"
                            color="primary"
                            sx={{
                              height: "24px",
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="textSecondary">
                        {result.dateCreated?.toLocaleDateString()}
                      </Typography>
                    </Box>
                  </ListItemButton>
                );
              })}
            </List>
            {/* Display fetch more messages button */}
            {results?.hasMore && (
              <Box
                ref={bottomSearchMessagesRef}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                height={"50px"}
                width={"100%"}
              >
                <CircularProgress color="primary" size={20} />
              </Box>
            )}
          </>
        )}
        {search.isSearching && (
          <Box
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            height={"100%"}
            width={"100%"}
          >
            <CircularProgress color="primary" size={60} />
          </Box>
        )}
        {!search.isSearching && totalResults === 0 && (
          <Box
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            height={"100%"}
            width={"100%"}
          >
            <Typography variant="h6" color="textSecondary">
              No results found
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};
